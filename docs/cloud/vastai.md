---
sidebar_position: 7
id: vastai
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Vast.ai, GPU, runners, cloud, Authentication]
---

# Vast.ai

If you're using Vast.ai as a cloud provider for Cirun, this is how you would give
Cirun access to your Vast.ai account, for it to be able to create GPU runners.

- Go to your [Vast.ai Account](https://cloud.vast.ai/account/) and generate an API key
- Paste your API key in the "Cloud" Tab of Cirun Dashboard under the Vast.ai section

## Configuration

Vast.ai runners are GPU-first. The GPU type and count are specified via
`instance_type`, and the environment is defined by a Docker image (container mode)
or a VM image (VM mode).

### Container Mode

The default mode runs the runner inside a Docker container with SSH access:

```yaml
runners:
  - name: vastai-gpu-runner
    cloud: vast_ai
    instance_type: 1xRTX_4090
    machine_image: nvidia/cuda:12.0.0-base-ubuntu22.04
    labels:
      - cirun-vastai-gpu
    extra_config:
      disk_space: 30
```

### VM Mode

For workloads that need a full virtual machine instead of a container, set
`vm: true` in `extra_config` and use a Vast.ai VM image:

```yaml
runners:
  - name: vastai-gpu-vm-runner
    cloud: vast_ai
    instance_type: 1xRTX_4090
    machine_image: vastai/kvm:ubuntu_cli_22.04-2025-11-21
    labels:
      - cirun-vastai-gpu-vm
    extra_config:
      disk_space: 30
      vm: true
```

### Instance Type

The `instance_type` field specifies the number of GPUs and the GPU model in the
format `{count}x{gpu_model}`:

```yaml
instance_type: 1xRTX_4090        # 1x RTX 4090
instance_type: 4xA100_SXM         # 4x A100 SXM
instance_type: 2xH100             # 2x H100
instance_type: 8xA100_SXM4_80GB   # 8x A100 SXM4 80GB
```

Use underscores in place of spaces for GPU model names.

### Machine Image

For container mode, use any Docker image (e.g. `nvidia/cuda:12.0.0-base-ubuntu22.04`).
For VM mode, use a Vast.ai VM image (e.g. `vastai/kvm:ubuntu_cli_22.04-2025-11-21`).

### Region

Region is optional. When specified, use a country code to restrict which
datacenter the runner is placed in:

```yaml
region: US
```

### Extra Configuration

| Option | Type | Description |
|--------|------|-------------|
| `disk_space` | number | Minimum disk space in GB |
| `min_ram` | number | Minimum RAM in GB |
| `vm` | boolean | Use VM mode instead of container mode |

```yaml
extra_config:
  disk_space: 30
  min_ram: 8
  vm: true
```
