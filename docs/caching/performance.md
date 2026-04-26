---
sidebar_position: 3
---

# Performance & tuning

Cirun cache transfers go directly from the runner to your S3 bucket inside your AWS account, in the same region. Throughput is determined by, in order:

1. **EBS volume throughput** — `gp3` defaults to **125 MBPS** regardless of size. Most common bottleneck.
2. **Instance class** — NIC bandwidth and vCPUs available for parallel TLS.
3. **Cache size** — `actions/cache` uses fewer parallel workers on small caches.

## Benchmarks

Numbers below are measured against a 10 GB random-data payload (incompressible — represents worst-case for binary artifacts) in `eu-west-1` with `gp3 Throughput: 1000`.

| Instance | Restore | Save |
|---|---|---|
| `m5n.xlarge`     | ~400 MB/s | ~250 MB/s |
| `m5n.4xlarge`    | ~590 MB/s | ~340 MB/s |
| `c6gn.4xlarge`   | ~780 MB/s | ~525 MB/s |
| `c6gn.8xlarge`   | ~785 MB/s | ~530 MB/s |

We've not benchmarked every instance class. If you need a number for a specific instance type, [open an issue](https://github.com/cirunlabs/cirun-docs/issues).

Save throughput is consistently 60-70% of restore at the same instance class. Save uses S3 multipart upload (64 MB chunk × 8 concurrent uploads); restore uses parallel ranged GETs (32 MB block × 8 workers, fanned into 8 sub-fetches per worker for 64 simultaneous S3 connections at peak).

## Decompression overhead

The transfer rate above is what `actions/cache` reports as "Received N MB at X MB/s". The overall step time also includes:

- **`tar` extraction** — single-threaded `unzstd` while writing to disk. On 10 GB of incompressible data: ~12-15 seconds on `c6gn.4xlarge`.
- **GitHub Actions step overhead** — ~3-5 seconds for setup and cleanup.

For a 10 GB restore at ~780 MB/s, the transfer is ~13 s but total step wall-clock is closer to ~25 s. Decompression dominates below ~5 GB; transfer dominates above.

## Cache size tiers

`actions/cache` adapts its parallel-fetch tier to the cache size:

| Cache size    | Workers | Per-block size | Typical throughput |
|---|---|---|---|
| < 100 MB      | 2  | 8 MB  | ~80-150 MB/s   |
| 100 MB – 1 GB | 4  | 16 MB | ~250-450 MB/s  |
| 1 GB – 5 GB   | 8  | 32 MB | ~500-700 MB/s  |
| > 5 GB        | 12 | 64 MB | ~700-800 MB/s  |

Small caches cannot reach headline numbers regardless of instance class — they're parallelism-limited by `actions/cache` itself.

## Parallel jobs

Two simultaneous cache jobs against distinct keys each saturate their own pipeline. Cirun does not pool throughput across jobs.

The S3 per-prefix rate limit only applies when multiple jobs hammer the same object key from the same source. In `actions/cache` semantics, each unique `(key, version)` pair maps to a unique S3 object name, so this doesn't happen in practice — matrix builds with the same key but different OS/arch get distinct version hashes.

## Tuning checklist

1. **Set `Throughput: 1000`** on the gp3 volume. The default 125 MBPS caps cache transfer near 150 MB/s.
2. **Pick an instance with enough network bandwidth** for your cache size. See the benchmark table.
3. **Pin `actions/cache` to v5** (Node 24). v4 works but emits a Node 20 deprecation notice; v5 is the default going forward.

## See also

- [Caching overview](/caching/) — quick start, how it works, compatibility
- [AWS-specific configuration](/caching/aws) — IAM permissions, region selection
- [Troubleshooting](/caching/troubleshooting) — diagnosing slow / missing / failing caches
