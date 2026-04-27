---
sidebar_position: 4
---

# S3-compatible caching

In addition to the AWS-backed Cirun cache (which lives in your AWS account, same region as the runner, with credentials issued by Cirun), Cirun publishes a self-serve action that talks to **any S3-compatible bucket** — Cloudflare R2, Backblaze B2, MinIO, SeaweedFS, AWS S3 directly, or anything else that speaks the S3 API.

This is the right choice when:

- Your runners are on-prem (Hetzner, your own datacenter, etc.) and AWS egress charges would dominate the cost.
- You already have an R2 / B2 / MinIO bucket and want to reuse it.
- You want to share one cache bucket across multiple repos, organizations, or runner clouds.

The action is `cirunlabs/cache/s3` (and the matching `s3-restore` / `s3-save` variants for split-step workflows).

## Quick start

### Cloudflare R2 (recommended for on-prem)

R2 has **zero egress** charges, which makes it the cheapest option for runners outside AWS. ~$0.015/GB-month storage, ~$4.50/M Class A operations, ~$0.36/M Class B operations.

1. **Create an R2 bucket** in the Cloudflare dashboard. Note your **Account ID** (Dashboard → R2 → Overview).
2. **Create an R2 API token** (Dashboard → R2 → Manage R2 API Tokens). Permissions: `Object Read & Write` for the bucket. Optionally `Edit` permission on the bucket so the action can manage lifecycle rules — without it, set lifecycle manually (see below).
3. **Add repository secrets**:
    - `S3_ENDPOINT` = `https://<ACCOUNT_ID>.r2.cloudflarestorage.com`
    - `S3_ACCESS_KEY_ID` = the token's Access Key ID
    - `S3_SECRET_ACCESS_KEY` = the token's Secret Access Key
4. **Add a workflow step**:

    ```yaml
    - uses: cirunlabs/cache/s3@0d5005be5be8cb3f20e624125e3fca0dc68eb384  # v5.0.5-cirun.1
      with:
        path: |
          ~/.cache/go-build
          ~/go/pkg/mod
        key: ${{ runner.os }}-${{ runner.arch }}-go-${{ hashFiles('**/go.sum') }}
        restore-keys: |
          ${{ runner.os }}-${{ runner.arch }}-go-
        s3-bucket: my-cache-bucket
        s3-endpoint: ${{ secrets.S3_ENDPOINT }}
        s3-region: auto
        s3-access-key-id: ${{ secrets.S3_ACCESS_KEY_ID }}
        s3-secret-access-key: ${{ secrets.S3_SECRET_ACCESS_KEY }}
        s3-prefix: my-repo
        s3-ttl-days: 30
    ```

`s3-region: auto` is the right value for R2.

### AWS S3 (BYO bucket)

If you already have an S3 bucket (or want one outside Cirun's auto-managed `cirun-caching-*` setup):

1. **Create the bucket** in your preferred region.
2. **Create an IAM user** with `s3:GetObject`, `s3:PutObject`, `s3:DeleteObject`, `s3:ListBucket`, `s3:GetBucketLifecycleConfiguration`, `s3:PutBucketLifecycleConfiguration` on the bucket. Optionally narrow to a specific prefix via the resource ARN.
3. **Add repository secrets**: `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`. (No endpoint needed for AWS.)
4. **Add a workflow step**:

    ```yaml
    - uses: cirunlabs/cache/s3@0d5005be5be8cb3f20e624125e3fca0dc68eb384  # v5.0.5-cirun.1
      with:
        path: |
          ~/.cache/go-build
          ~/go/pkg/mod
        key: ${{ runner.os }}-${{ runner.arch }}-go-${{ hashFiles('**/go.sum') }}
        restore-keys: |
          ${{ runner.os }}-${{ runner.arch }}-go-
        s3-bucket: my-cache-bucket
        s3-region: us-east-1                  # your bucket's region
        s3-access-key-id: ${{ secrets.S3_ACCESS_KEY_ID }}
        s3-secret-access-key: ${{ secrets.S3_SECRET_ACCESS_KEY }}
        s3-prefix: my-repo
        s3-ttl-days: 30
    ```

Omit `s3-endpoint` for AWS S3 — the SDK auto-resolves the regional endpoint.

### Other S3-compatible backends

- **Backblaze B2**: `s3-endpoint` = `https://s3.us-west-002.backblazeb2.com` (or your region's URL), `s3-region` = the B2 region (e.g. `us-west-002`).
- **MinIO / SeaweedFS / self-hosted**: `s3-endpoint` = your server URL, `s3-region` = `auto` or whatever your install uses.

## Pinning the action version

The fork is published from `cirunlabs/cache` (default branch `cirun-fork`). Pin to a commit SHA for reproducibility — the same rule that applies to all third-party actions (no mutable tags or branches in production workflows):

```yaml
uses: cirunlabs/cache/s3@0d5005be5be8cb3f20e624125e3fca0dc68eb384  # v5.0.5-cirun.1
```

Latest tag and corresponding SHA are listed at https://github.com/cirunlabs/cache/tags.

## Composite vs split actions

The action ships in three flavours, mirroring upstream `actions/cache`:

| Action | Use when |
|---|---|
| `cirunlabs/cache/s3` | Most common. Restores at the start, auto-saves in the post step on cache miss. |
| `cirunlabs/cache/s3-restore` | You want to run save unconditionally later (e.g. always save, even on hit, or save in a different job). |
| `cirunlabs/cache/s3-save` | Pair with `s3-restore`. Save explicitly with a different key, or skip save under custom conditions. |

The composite version (`cirunlabs/cache/s3`) is what you want unless you have a reason for the split.

## Inputs

| Input | Required | Default | Description |
|---|---|---|---|
| `path` | yes | — | Newline-separated list of files/dirs to cache. `~/` is expanded. |
| `key` | yes | — | Primary cache key. Typical: `${{ runner.os }}-${{ runner.arch }}-go-${{ hashFiles('**/go.sum') }}`. |
| `restore-keys` | no | — | Newline list of fallback prefixes. Most-recently-modified entry under each prefix that matches the same `path` shape is restored. |
| `enableCrossOsArchive` | no | `false` | Strip OS from the cache key so a Linux-saved archive can restore on macOS, etc. Rarely useful. |
| `fail-on-cache-miss` | no | `false` | Fail the workflow if no cache entry matches. |
| `lookup-only` | no | `false` | Only check existence; don't download. |
| `s3-bucket` | yes | — | Bucket name. |
| `s3-endpoint` | no | `''` (= AWS S3) | Endpoint URL for non-AWS backends. |
| `s3-region` | no | `auto` | Region. `auto` is correct for R2; for AWS S3 set the bucket's region. |
| `s3-access-key-id` | no | — | Use a repository secret. |
| `s3-secret-access-key` | no | — | Use a repository secret. |
| `s3-prefix` | no | `''` | Sub-folder inside the bucket. Useful when sharing one bucket across multiple repos. |
| `s3-ttl-days` | no | `30` | Days before objects expire. The action ensures a bucket lifecycle rule (idempotent, preserves unrelated rules). Set to `0` to disable lifecycle management. |

## Lifecycle / TTL

By default (`s3-ttl-days: 30`), the action ensures a bucket lifecycle rule that expires objects under `s3-prefix` after 30 days. The rule is idempotent — only updated when its days/status differs from the desired state — and preserves any unrelated rules in the bucket so it's safe to share a bucket across multiple uses.

If your access credential lacks `s3:PutLifecycleConfiguration` (or R2's equivalent), the action emits a warning and the cache save still succeeds. You can then set the rule manually:

**Cloudflare R2 (wrangler):**

```bash
cat > lifecycle.json <<'EOF'
{
  "rules": [{
    "id": "cirunlabs-cache-my-repo",
    "enabled": true,
    "conditions": { "prefix": "my-repo/" },
    "deleteObjectsTransition": {
      "condition": { "type": "Age", "maxAge": 2592000 }
    }
  }]
}
EOF
wrangler r2 bucket lifecycle set my-cache-bucket --file lifecycle.json
```

**AWS S3 (aws CLI):**

```bash
aws s3api put-bucket-lifecycle-configuration \
  --bucket my-cache-bucket \
  --lifecycle-configuration '{
    "Rules": [{
      "ID": "cirunlabs-cache-my-repo",
      "Status": "Enabled",
      "Filter": { "Prefix": "my-repo/" },
      "Expiration": { "Days": 30 }
    }]
  }'
```

To opt out entirely, set `s3-ttl-days: 0` and the action will not touch lifecycle config.

## Object naming

Cache entries are stored at:

```
<bucket>/<s3-prefix>/<runner-os>/<key>/<version>.tzst
```

Where:
- `<runner-os>` = `Linux`, `Windows`, or `macOS` (or `any` when `enableCrossOsArchive: true`).
- `<key>` = your primary cache key.
- `<version>` = a 16-char SHA-256 of the path list + OS marker. Two saves with the same key but different `path` inputs land at different versions and don't collide.

You can browse / clean up entries directly via the R2 / S3 console.

## Throughput

Restore uses **8 parallel ranged GETs** (32 MB blocks) into a pre-allocated file, then `zstd -d -T0` for multi-threaded decompression. Save uses S3 multipart upload via `@aws-sdk/lib-storage` (64 MB part × 8 concurrent uploads) plus `zstd -T0 --long=30` for fast multi-threaded compression.

Indicative numbers measured on `c6gn.4xlarge` (eu-west-1) → R2:

| Operation | 1 GB random data |
|---|---|
| Restore (parallel ranged GETs + zstd -T0 extract) | ~5 s ≈ 200 MB/s |
| Save (tar + zstd encode + multipart upload) | ~8 s ≈ 122 MB/s |

For AWS S3 same-region, expect 2-3× higher throughput on restore (closer to the 700-800 MB/s S3 single-prefix ceiling).

## Choosing between Cirun cache and S3-compatible cache

| | Cirun cache (AWS-managed) | S3-compatible action |
|---|---|---|
| Setup | `extra_config.cache: true` in `.cirun.yml` | Workflow step + repo secrets |
| Storage location | Per-customer S3 bucket in your AWS account, same region as runner | Any S3-compatible bucket you own |
| Credentials | Short-lived STS tokens issued by Cirun | Static keys you provide |
| Cost | AWS S3 storage ($0.023/GB-mo) | Whatever your provider charges (R2: $0.015/GB-mo, $0 egress) |
| Throughput | Up to ~780 MB/s on c6gn.4xlarge (parallel ranged GETs via cache proxy) | Same parallel pattern; ~200 MB/s to R2, near-S3-ceiling to AWS S3 same-region |
| Best for | AWS-hosted runners, cache > 5 GB | On-prem runners, cross-cloud setups, BYO storage |

You can also use both — the Cirun cache for AWS-hosted runners and the S3-compatible action for your on-prem runners — by adding the workflow step under a `runs-on` condition.

## See also

- [Caching overview](/caching/) — quick start, how it works, compatibility
- [Performance & tuning](/caching/performance) — benchmarks per instance
- [Troubleshooting](/caching/troubleshooting) — diagnosing slow / missing caches
