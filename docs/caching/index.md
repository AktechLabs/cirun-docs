---
sidebar_position: 1
---

# Caching

Cirun provides drop-in cache acceleration for GitHub Actions workflows. Enable it once in `.cirun.yml`; cache reads and writes flow direct between your runner and your own cloud storage account, with no GitHub-hosted cache hops in the data path.

In benchmarks, a single 10 GB cache restores in **~13 seconds** on a `c6gn.4xlarge` runner. Throughput scales with instance class — bigger NICs and more vCPUs push higher, and parallel cache jobs against distinct keys each saturate their own connection independently.

:::caution
Caching is currently supported on **Linux runners on AWS**. Other clouds and platforms are on the roadmap.
:::

## What you get

- **Drop-in compatibility** with `actions/cache`, `actions/setup-*` (`setup-go`, `setup-node`, `setup-python`, `setup-java`, …), `Swatinem/rust-cache`, `prefix-dev/setup-pixi`, and any other action that uses GitHub's cache backend (`@actions/cache`, `@actions/toolkit/cache`).
- **Throughput scales with instance class** — `m5n.xlarge` reaches ~400 MB/s, `c6gn.4xlarge` ~780 MB/s, larger NICs (`c6gn.16xlarge`, `c7gn.16xlarge` with 100 Gbps networking) push higher still. Save throughput tracks restore at roughly 60-70%. Numbers per instance type are in the [Performance](/caching/performance) page.
- **Direct EC2 ↔ S3 transfer** — bytes never traverse Cirun's infrastructure or the public internet outside your AWS region.
- **Per-customer storage** — every customer's cache lives in their own S3 bucket in their own AWS account. No shared multi-tenant store; no cross-tenant noise.
- **No quota or rate-limit on cache size** — limited only by your own S3 bucket size and AWS account quotas.
- **`docker/build-push-action` support** via `type=gha,url_v2=…` (see below).

## How it works

When you set `extra_config.cache: true`, Cirun:

1. Boots the runner with a small cache proxy listening on `127.0.0.1:6420` (loopback only — never exposed off the host).
2. Injects environment so `actions/cache` (and any compatible action) talks to that local proxy instead of GitHub's hosted cache backend.
3. The proxy authenticates to your S3 bucket using **temporary STS credentials** that are auto-refreshed for the runner's lifetime — no long-lived secrets ever land on the runner.
4. Cache reads use **8 parallel ranged GETs** with **32 MB blocks** against an S3 presigned URL; the proxy fans each out to 8 sub-range fetches (64 simultaneous S3 connections at peak) and streams to the workflow.
5. Cache writes use **multipart upload** with parallel chunks (default 64 MB chunk × 8 concurrent uploads).

The bucket name is deterministic: `cirun-caching-<region>-<user_uuid_prefix>-<account_id_hash>`. It's auto-created on the first cache request.

## Quick start

### 1. Enable caching in `.cirun.yml`

```yaml
runners:
  - name: aws-cache-runner
    cloud: aws
    region: eu-west-1
    instance_type: c6gn.4xlarge          # see the Performance page for sizing
    machine_image: ami-062db60591ca5a606  # Ubuntu 22.04 ARM64 in eu-west-1
    labels:
      - cirun-aws-cache
    extra_config:
      cache: true                         # ← the only required line
      BlockDeviceMappings:
        - DeviceName: /dev/sda1
          VolumeType: gp3
          VolumeSize: 100
          Iops: 6000
          Throughput: 1000                # raise above the default 125 MBPS
```

### 2. Update IAM permissions

The IAM principal used by Cirun needs a small extra permission set. Copy-paste the policy from [AWS permissions](/caching/aws#permissions) into your Cirun cloud-connect user.

### 3. Use a cache-aware action

No workflow change needed for most actions — Cirun transparently redirects:

```yaml
- uses: actions/cache@v5
  with:
    path: ./build
    key: ${{ runner.os }}-${{ hashFiles('**/lock.json') }}
```

The same applies to `actions/setup-go`, `actions/setup-node`, `actions/setup-python`, `actions/setup-java`, `Swatinem/rust-cache`, `prefix-dev/setup-pixi`, and any action that uses `@actions/cache` internally.

### 4. (Optional) Docker buildx

`docker/build-push-action` needs two extra options to use Cirun cache instead of GitHub's hosted cache:

```yaml
- uses: docker/setup-buildx-action@v3
  with:
    driver-opts: network=host           # required

- uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: user/app:latest
    cache-from: type=gha,url_v2=http://127.0.0.1:6420/
    cache-to:   type=gha,mode=max,url_v2=http://127.0.0.1:6420/
```

:::caution
Use `url_v2`, not `url`. The `url` option is a different (older, slower) protocol that Cirun does not support. Without `url_v2`, buildx will silently fall back to GitHub's hosted cache.
:::

## Performance

Single-job throughput on a 10 GB payload in `eu-west-1`:

| Instance | Restore | Save |
|---|---|---|
| `m5n.xlarge`     | ~400 MB/s | ~250 MB/s |
| `m5n.4xlarge`    | ~590 MB/s | ~340 MB/s |
| `c6gn.4xlarge`   | ~780 MB/s | ~525 MB/s |
| `c6gn.8xlarge`   | ~785 MB/s | ~530 MB/s |

Numbers are per-job, per-instance, single-cache-key. Parallel cache jobs against distinct keys each saturate their own pipeline. See [Performance & tuning](/caching/performance) for cache-size tiers and the gp3 throughput note.

## Compatibility

| Tool / Action | Status | Notes |
|---|---|---|
| `actions/cache@v5` (Node 24) | ✅ Recommended | Latest stable |
| `actions/cache@v4` (Node 20) | ✅ | Node 20 will be removed from runners 2026-09-16 — pin to `@v5` to silence the deprecation notice. |
| `actions/setup-go` | ✅ | Built-in cache |
| `actions/setup-node` | ✅ | Built-in cache (`cache: 'npm'`, `cache: 'yarn'`, etc.) |
| `actions/setup-python` | ✅ | Built-in cache (`cache: 'pip'`, `cache: 'pipenv'`, etc.) |
| `actions/setup-java` | ✅ | Built-in cache (`cache: 'maven'`, `cache: 'gradle'`) |
| `Swatinem/rust-cache` | ✅ | |
| `prefix-dev/setup-pixi` | ✅ | |
| `astral-sh/setup-uv` | ✅ | |
| `docker/build-push-action` | ✅ | Requires `url_v2` (see [Quick start](#4-optional-docker-buildx)) |
| `docker/build-push-action` with `type=gha` (no `url_v2`) | ❌ | Falls back to GitHub-hosted cache, slow |
| `actions/cache/save@v4` standalone with explicit `key` | ✅ | |
| Self-hosted runners outside Cirun | ❌ | Cache is provisioned per Cirun-managed runner |

## Common questions

- **Where is the cache stored?** In an S3 bucket inside *your* AWS account, in the same region as the runner. Bucket name: `cirun-caching-<region>-<user_uuid_prefix>-<account_id_hash>`. You can inspect, audit, and lifecycle-rule it yourself.
- **Does my cache leave AWS?** No. Bytes flow runner ↔ S3 over the AWS internal network in your region. Cirun infrastructure only handles the small metadata calls (key/version registry + STS credential issuance).
- **What credentials live on the runner?** Only short-lived STS session tokens (1 h validity, auto-refreshed by the local cache proxy). Your long-lived AWS access keys never leave Cirun's backend.
- **How do cache keys / restore-keys work?** Same as upstream `actions/cache` — keys + version (hash of files) form a deterministic S3 object name. `restore-keys` work identically; partial-prefix matches return the most recent.
- **Is there a size limit?** No Cirun-imposed limit. AWS S3 bucket and account quotas apply (default S3 account quota is 100 buckets × unbounded objects).
- **How long is the cache retained?** The bucket has a default S3 lifecycle policy of **7 days** (entries not accessed in 7 days are automatically deleted to control storage costs). You can override this on your bucket if you need longer retention.
- **Can I use this with self-hosted runners outside Cirun?** Not yet — the cache proxy and STS issuance are provisioned per Cirun-managed runner. Standalone use against your own S3 / R2 / B2 / MinIO is on the roadmap.
- **Why is my cache slow on small caches?** Caches < 100 MB use only 2 parallel workers with 8 MB blocks (the `actions/cache` defaults, optimised for a fast-start small-payload case). You'll see 50-150 MB/s on a 50 MB cache and 700+ MB/s only on caches > 1 GB. This is the same on every cache provider — TLS handshake + ramp-up dominates for small payloads.
- **Why does my first cache run miss?** A cache key that has never been saved before is a miss. This is expected. After the first save, subsequent runs with the same key will hit. The "warmup" is one job per cache key.

## Troubleshooting

If you see slow performance, cache misses, or auth errors, see [Troubleshooting](/caching/troubleshooting).

## See also

- [AWS-specific configuration](/caching/aws) — IAM permissions, throughput tuning, bucket details
- [Performance & tuning](/caching/performance) — benchmarks per instance type, sizing guidance, what affects throughput
- [Troubleshooting](/caching/troubleshooting) — common issues and how to diagnose them
