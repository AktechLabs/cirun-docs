---
sidebar_position: 4
---

# Troubleshooting

If your cache is slow, missing, or erroring, work through these in order. Each section starts with the symptom and gives a quick diagnostic.

## Cache is slow

### Step 1 — confirm `extra_config.cache: true` is honoured

Add a debug step to your workflow:

```yaml
- name: Check cache env
  run: env | grep -E 'HTTPS_PROXY|NO_PROXY'
```

Expected output:

```
HTTPS_PROXY=http://127.0.0.1:6421
NO_PROXY=127.0.0.1,localhost
```

If either is missing, `cache: true` was not picked up — double-check the `extra_config` indentation in your `.cirun.yml`. YAML errors here often silently disable the flag.

### Step 2 — check EBS volume throughput

The default gp3 throughput cap is **125 MBPS regardless of volume size**. If your cache restore caps near 150 MB/s, this is almost certainly why.

Add to your `extra_config`:

```yaml
extra_config:
  cache: true
  BlockDeviceMappings:
    - DeviceName: /dev/sda1
      VolumeType: gp3
      VolumeSize: 100
      Iops: 6000
      Throughput: 1000           # gp3 max
```

Verify it took effect by inspecting the live volume during the job:

```yaml
- name: Check EBS throughput
  run: |
    TOKEN=$(curl -s -X PUT http://169.254.169.254/latest/api/token \
            -H "X-aws-ec2-metadata-token-ttl-seconds: 60")
    INSTANCE=$(curl -s -H "X-aws-ec2-metadata-token: $TOKEN" \
               http://169.254.169.254/latest/meta-data/instance-id)
    echo "instance=$INSTANCE"
    # Then look up the volume's Throughput in your AWS account:
    # aws ec2 describe-volumes --filters Name=attachment.instance-id,Values=$INSTANCE
```

### Step 3 — check instance class

Cache throughput scales with instance class. If you're on `t3.large` or similar burstable instances, expect 80-150 MB/s — that's the instance limit, not the cache.

See [Performance & tuning](/caching/performance) for per-instance numbers and recommendations. Short answer: use **`c6gn.4xlarge`** for anything more than a basic build.

### Step 4 — check cache size tier

If your cache is < 100 MB, you'll see ~80-150 MB/s and that's expected — `actions/cache` only uses 2 parallel workers below that threshold. Caches 100 MB–1 GB use 4 workers (~250-450 MB/s); 1-5 GB use 8 workers (~500-700 MB/s); > 5 GB unlocks 12 workers (~700-800 MB/s).

You **cannot** push small caches faster regardless of instance — the parallelism is set by `actions/cache` itself.

### Step 5 — confirm Cirun cache is engaged

The clearest signal is the throughput itself: a 1+ GB cache restoring at 50-150 MB/s is hitting GitHub's hosted cache. The same restore on Cirun cache, with `Throughput: 1000` set, lands in the 400-780 MB/s range depending on instance class. If you're seeing the slow path despite `extra_config.cache: true` and the env vars from Step 1, [open an issue](https://github.com/AktechLabs/cirun-docs/issues) with the run URL.

## Cache misses every time

### Step 1 — confirm key consistency

`actions/cache` keys must match exactly between save and restore runs. Most-common gotcha: hashing `**/*.lock` matches different files than `**/lock` or `lock.json`.

Verify by printing the key from both runs:

```yaml
- run: echo "key=${{ runner.os }}-${{ hashFiles('**/lock.json') }}"
```

If the hashes differ between save and restore, the file set being hashed differs (e.g. you regenerated lockfiles, you have OS-specific files, etc.).

### Step 2 — check the bucket exists

Cirun creates the S3 bucket on first cache request. If the IAM user lacks `s3:CreateBucket` permission (or the role policies in [AWS permissions](/caching/aws#permissions) are incomplete), the first request fails and the cache silently falls back to a no-op state.

Verify the bucket exists in your AWS account:

```bash
aws s3 ls | grep cirun-caching-
```

If no bucket exists despite cache-enabled jobs running, check IAM permissions.

### Step 3 — check the lifecycle policy hasn't expired your cache

The default S3 lifecycle policy on `cirun-caching-*` buckets is **7 days** since last access. If your workflow runs less often than that, restores will miss because the cache was deleted.

You can override the lifecycle policy on your bucket directly via the AWS console or CLI to extend retention.

## Cache requests fail with 500

If you see workflow errors like `Failed to save cache: Internal error` or `Cache request failed (500)`:

### Step 1 — IAM permissions

Most 500 errors come from the IAM user lacking required permissions for `STS AssumeRole`, `s3:CreateBucket`, or one of the IAM operations on `CirunCacheRole`. Re-check against [AWS permissions](/caching/aws#permissions). The most-common single missing permission is `iam:UpdateAssumeRolePolicy` — needed when Cirun updates an existing role's trust policy.

### Step 2 — STS region

The runner's region must be one Cirun supports. As of 2026-04, all major AWS regions are supported.

## Cache save fails on long-running jobs

**Symptom:** `actions/cache` save step fails with `SyntaxError: Unexpected token 'o', "operation "... is not valid JSON` on jobs running longer than 1 hour.

**Cause:** STS session credentials issued at runner boot expire after 1 hour. The runner-side proxy refreshes them automatically, but older runner images held them statically.

**Fix:** This is fixed on current Cirun runners. If you're hitting this, [open an issue](https://github.com/AktechLabs/cirun-docs/issues) with the run URL so we can confirm the runner image.

If you're using a self-built or pinned older AMI, refresh to a current Cirun image.

## Docker buildx cache is slow

**Symptom:** `docker/build-push-action` with cache enabled is slower than expected.

**Cause:** Without `url_v2`, buildx uses an older protocol that Cirun doesn't accelerate — it falls back to GitHub's hosted cache.

**Fix:** Use `url_v2` on both `cache-from` and `cache-to`:

```yaml
- uses: docker/setup-buildx-action@v3
  with:
    driver-opts: network=host        # required

- uses: docker/build-push-action@v6
  with:
    cache-from: type=gha,url_v2=http://127.0.0.1:6420/
    cache-to:   type=gha,mode=max,url_v2=http://127.0.0.1:6420/
```

`network=host` on the buildx driver is required so the build container can reach `127.0.0.1:6420` (the Cirun cache proxy listening on the runner host).

## Workflow shows "Node.js 20 actions are deprecated"

**Symptom:** Yellow deprecation banner from GitHub:

> Node.js 20 actions are deprecated. The following actions are running on Node.js 20 and may not work as expected: …

**Cause:** You're using `actions/cache@v4` (or another action pinned to a Node-20 version).

**Fix:** Upgrade to `actions/cache@v5` (Node 24) or pin to a specific commit SHA on `@v5`. Cirun's accelerator works identically on both versions.

## Still stuck?

When opening an issue or reaching out for support, include:

1. The output of the workflow step that's failing (the full `actions/cache` log lines).
2. Your `.cirun.yml`'s `extra_config` block (redact secrets if any).
3. The runner's region and instance type.
4. The run URL.

[Open an issue →](https://github.com/AktechLabs/cirun-docs/issues)

## See also

- [Caching overview](/caching/) — quick start and how it works
- [AWS-specific configuration](/caching/aws) — IAM permissions, bucket details
- [Performance & tuning](/caching/performance) — benchmarks per instance, sizing guidance
