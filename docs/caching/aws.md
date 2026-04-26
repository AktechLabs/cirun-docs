---
sidebar_position: 2
---

# Amazon Web Services

Cache files are stored in an S3 bucket in your own AWS account, same region as the runner. Cirun creates the bucket automatically on the first cache request.

## Bucket details

- **Name:** `cirun-caching-<region>-<user_uuid_prefix>-<account_id_hash>`
- **Region:** same as the runner's `region`
- **Versioning:** disabled
- **Lifecycle:** 7-day expiry on objects not accessed in the window (controls storage cost; override per-bucket if you need longer retention)
- **Access:** writable only by short-lived STS session credentials issued via the `CirunCacheRole` role; not directly accessible by your long-lived Cirun cloud-connect user

## Permissions

The IAM principal used by Cirun (i.e. the user whose credentials you supplied via cloud-connect) needs the policy below. Each statement is scoped tightly — to the `cirun-caching-*` bucket pattern and the `CirunCache*Role` role pattern — so you can attach this without granting broader access.

```json
{
    "Sid": "S3BucketManagement",
    "Effect": "Allow",
    "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning"
    ],
    "Resource": "arn:aws:s3:::cirun-caching-*"
},
{
    "Sid": "S3LifecycleManagement",
    "Effect": "Allow",
    "Action": [
        "s3:PutLifecycleConfiguration"
    ],
    "Resource": "arn:aws:s3:::cirun-caching-*"
},
{
    "Sid": "S3ObjectManagement",
    "Effect": "Allow",
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
    ],
    "Resource": "arn:aws:s3:::cirun-caching-*/*"
},
{
    "Sid": "IAMRoleManagement",
    "Effect": "Allow",
    "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:ListRoles",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:ListRolePolicies",
        "iam:GetRolePolicy",
        "iam:UpdateAssumeRolePolicy"
    ],
    "Resource": [
        "arn:aws:iam::*:role/CirunCacheRole",
        "arn:aws:iam::*:role/CirunCache*Role"
    ]
},
{
    "Sid": "STSOperations",
    "Effect": "Allow",
    "Action": [
        "sts:GetCallerIdentity"
    ],
    "Resource": "*"
},
{
    "Sid": "STSAssumeRole",
    "Effect": "Allow",
    "Action": [
        "sts:AssumeRole"
    ],
    "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/CirunCache*"
},
{
    "Sid": "AllowPolicySimulation",
    "Effect": "Allow",
    "Action": [
        "iam:SimulatePrincipalPolicy",
        "iam:GetContextKeysForPrincipalPolicy",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:GetUserPolicy",
        "iam:GetRolePolicy"
    ],
    "Resource": "*"
}
```

Replace `<ACCOUNT_ID>` with your AWS account ID. `AdministratorAccess` covers all of these but the scoped policy above is recommended.

## Throughput tuning

There are three tunables. In order of impact:

### 1. Instance type

The single largest lever. ARM-based `c6gn` instances roughly **2× the throughput per dollar** of `m5n` for cache workloads. See [Performance & tuning](/caching/performance) for full numbers and sizing guidance.

### 2. EBS volume throughput (`Throughput`)

By default, every gp3 volume is capped at **125 MBPS regardless of size or IOPS**. This is the most common cause of "my cache is slower than I expected" — the bottleneck is the disk read for save / disk write for restore, not the network or S3.

Raise it explicitly via `BlockDeviceMappings`:

```yaml
extra_config:
  cache: true
  BlockDeviceMappings:
    - DeviceName: /dev/sda1
      VolumeType: gp3
      VolumeSize: 100               # GB
      Iops: 6000                    # default 3000; gp3 supports up to 16000
      Throughput: 1000              # default 125 MBPS; gp3 supports up to 1000 MBPS
```

`Throughput: 1000` is the gp3 max and is required to actually hit the ~780 MB/s figures in our benchmarks. Below ~600 MBPS you will be disk-bound, not network-bound.

### 3. Cache size

`actions/cache` adapts its parallel-fetch tier to the cache size. Each tier increases worker count:

| Cache size | Workers | Per-block size |
|---|---|---|
| < 100 MB | 2 | 8 MB |
| 100 MB – 1 GB | 4 | 16 MB |
| 1 GB – 5 GB | 8 | 32 MB |
| > 5 GB | 12 | 64 MB |

This means small caches won't saturate a fast network (and don't need to). Headline benchmark numbers are for caches **> 1 GB**.

## Region selection

Pick the same AWS region as your S3 cache bucket and your build dependencies. Cross-region cache transfer is supported but slower and incurs egress charges.

For Europe: `eu-west-1` (Ireland) has historically the best `c6gn` capacity and lowest in-region RTT to S3.

For US: `us-east-1` (N. Virginia) for breadth of capacity, `us-east-2` (Ohio) and `us-west-2` (Oregon) as alternatives.

For ARM workloads specifically (`c6gn.*`, `c7g.*`, `m7g.*`), all major regions support these. They are **not** restricted to specific zones.

## Operational notes

- **Cache buckets are created on demand.** The first cache-enabled run in a new region creates the bucket; subsequent runs in the same region reuse it.
- **You own the bucket.** You can list, audit, lifecycle-rule, encrypt, replicate, or grant cross-account access just like any S3 bucket.
- **STS sessions auto-refresh.** The runner-side proxy fetches a 1 h STS token at boot and auto-refreshes it ~5 min before expiry, so jobs longer than 1 h continue saving correctly. Total refresh window is bounded by the runner's authentication token lifetime (24 h) — well above GitHub Actions' 6 h job hard cap.
- **Costs.** S3 storage in the bucket is billed to your AWS account at the standard S3 storage rate (~$0.023/GB-month in `us-east-1`). The 7-day lifecycle policy controls runaway accumulation. There are **no egress charges** for cache reads — bytes flow runner → S3 inside the same region.

## See also

- [Caching overview](/caching/) — how it works, quick start, compatibility
- [Performance & tuning](/caching/performance) — benchmarks per instance type
- [Troubleshooting](/caching/troubleshooting) — common issues and how to diagnose them
