---
slug: /
title: Introduction
description: Cirun runs GitHub Actions on your own cloud — fast, customisable, cheap.
keywords: [Cirun, Github Actions, Cirun cloud, Cloud Authentication]
---

# Introduction

Cirun is a managed self-hosted runner platform for GitHub Actions that lets you:

- **Run jobs on your own cloud** — bring AWS, GCP, Azure, Hetzner, DigitalOcean, Oracle, OpenStack, or Vast.ai credentials.
- **Pay your cloud, not the runner provider** — runners are cheaper than GitHub-hosted, especially at scale.
- **Pick any machine** — GPUs, ARM64, big-RAM, custom images. Per-job, no fleet to manage.
- **Cache GitHub Actions** without size limits — backed by your own S3 bucket.
- **Self-host on-prem** — register existing hardware (Linux, macOS, Windows) as a runner pool.

You configure runners as code in a single `.cirun.yml` file at the root of your repo. No fleet config, no autoscaling group to manage — Cirun spins runners up on demand and tears them down when the job finishes.

Here's a minimal `.cirun.yml` that gives a workflow access to a 4-CPU AWS runner:

```yaml
runners:
  - name: small-runner
    cloud: aws
    instance_type: c5.xlarge
    machine_image: ami-0c55b159cbfafe1f0
    region: us-east-1
    preemptible: false
    labels:
      - cirun-small
```

Then in `.github/workflows/build.yml`:

```yaml
jobs:
  build:
    runs-on: cirun-small
    steps:
      - uses: actions/checkout@v4
      - run: ./build.sh
```

That's it — push the change and Cirun will provision a runner from your AWS account for every job tagged `cirun-small`.

## Where to next

- **[Quickstart](/quickstart)** — connect your repo and run your first job.
- **[Reference](/reference/)** — full `.cirun.yml` schema and per-cloud options.
- **[Cloud setup](/cloud/)** — credentials and roles for AWS, GCP, Azure, and others.
- **[Caching](/caching/)** — speed up workflows with S3-backed actions cache.
- **[On-Prem](/on-prem)** — register existing hardware as runners.
