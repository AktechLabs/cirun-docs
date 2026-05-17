---
sidebar_position: 3
id: on-prem
description: Cirun Documentation - On Premise
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, on-premise, Apple Silicon, Mac Mini, Mac Pro, Linux, KVM, Docker, Cirun-agent]
---

# On Premise

Cirun supports spinning up runners on your own infrastructure. The agent picks
one of three executor backends based on the host and your `.cirun.yml`:

| Executor | Host requirement | Runner is a... |
|---|---|---|
| `meda` (default on Linux) | Linux with KVM | lightweight VM (cloud-hypervisor) |
| `lume` (default on macOS) | Apple Silicon (Mac Mini, Mac Pro, MacBook) | macOS VM (Apple Virtualization framework) |
| `docker` | Linux with Docker, **or** macOS with Docker Desktop | container |

The setup is simple and can be done in a few minutes. You install
`cirun-agent` on your machine, and it connects to Cirun's API to spin up
on-demand ephemeral runners for GitHub Actions.

## Setting up `cirun-agent`

1. Create an API token on the [Cirun Dashboard](https://cirun.io/admin/api).

2. Install the [cirun-agent](https://github.com/cirunlabs/cirun-agent):

    ```bash
    curl --proto '=https' --tlsv1.2 -LsSf https://raw.githubusercontent.com/cirunlabs/cirun-agent/refs/heads/main/install.sh | sh
    ```

3. Install and start as a system service (recommended):

    ```bash
    # Linux (systemd)
    export CIRUN_API_TOKEN=YOUR_TOKEN
    sudo -E cirun-agent --install-service

    # macOS (launchd)
    export CIRUN_API_TOKEN=YOUR_TOKEN
    cirun-agent --install-service
    ```

    The service starts on boot and restarts on failure. Logs go to the
    system journal (Linux) or `~/Library/Logs/cirun-agent.log` (macOS).

    **Alternative**: run manually in the foreground:
    ```bash
    export CIRUN_API_TOKEN=YOUR_TOKEN
    cirun-agent
    ```

4. Create a `.cirun.yml` file in your repository. Pick the executor that
   matches your host:

    **macOS VM (lume):**
    ```yml
    runners:
      - name: cirun-macos-runner
        cloud: on_prem
        instance_type: 8vcpu-8gb-100gb
        machine_image: "cirunlabs/macos-sequoia-xcode:16.4"
        region: RegionOne
        labels:
          - cirun-macos-runner
    ```

    :::tip
    Match `instance_type` to the template's native size. The agent resizes
    the macOS APFS disk via `lume`, which truncates and breaks boot if
    you request a size smaller than the source. The `xcode:16.4` template
    ships as 8 vCPU / 8 GB / 100 GB.
    :::

    **Linux VM (meda):**
    ```yml
    runners:
      - name: cirun-linux-runner
        cloud: on_prem
        instance_type: 8vcpu-8gb-75gb
        machine_image: "ubuntu:latest"
        region: RegionOne
        labels:
          - cirun-linux-runner
    ```

    **Docker container (linux or macOS host):**
    ```yml
    runners:
      - name: cirun-docker-runner
        cloud: on_prem
        instance_type: 4vcpu-8gb-50gb
        machine_image: "ghcr.io/cirunlabs/cirun-docker-runner-image:latest"
        region: RegionOne
        extra_config:
          executor: docker
          # Optional: start dockerd inside the container so jobs can
          # `docker build` / `docker run` (docker-in-docker).
          privileged: true
        labels:
          - cirun-docker-runner
    ```

    The [`cirun-docker-runner-image`](https://github.com/cirunlabs/cirun-docker-runner-image)
    is a multi-arch (amd64 + arm64) Ubuntu 24.04 image with the
    GitHub Actions runner deps and Docker pre-installed.

    **GPU Docker container (Linux host with NVIDIA):**
    ```yml
    runners:
      - name: cirun-gpu-docker-runner
        cloud: on_prem
        instance_type: 4vcpu-8gb-50gb
        machine_image: "ghcr.io/cirunlabs/cirun-docker-runner-image:gpu"
        region: RegionOne
        extra_config:
          executor: docker
          gpu: all
        labels:
          - cirun-gpu-docker-runner
    ```

    The `:gpu` tag adds CUDA 13.2.1 runtime libs on top of the same
    toolchain. Host needs `nvidia-container-toolkit` installed; `gpu: all`
    is passed through to `docker run --gpus`.

5. Configure your workflow to use the runner:

    ```yml
    runs-on: cirun-linux-runner--${{ github.run_id }}
    ```

    Make sure you have installed the Cirun GitHub App and marked the repository as active on the
    [Cirun Dashboard](https://cirun.io/admin/repositories).

## `extra_config` reference

Per-runner knobs under `extra_config:` in `.cirun.yml`. All are optional;
all apply to the `docker` executor unless noted.

| Key | Type | Effect |
|---|---|---|
| `executor` | `meda` \| `lume` \| `docker` | Override the host default. Required if the host supports more than one (e.g. Linux with Docker installed but you want a VM). |
| `privileged` | bool | Run the container with `--privileged`. Required for docker-in-docker. |
| `docker_socket_mount` | bool | Bind-mount `/var/run/docker.sock` from the host into the runner so jobs share the host daemon (docker-out-of-docker). |
| `gpu` | string (e.g. `all`) | Pass through to `docker run --gpus`. Requires `nvidia-container-toolkit` on the host. |

## Capacity planning

Unlike cloud runners (where capacity is the provider's problem), on-prem
runners share the finite CPU / RAM / disk of your host. Two knobs let you
shape concurrency:

### Cap concurrent runners with `--max-runners`

`cirun-agent` will not start more runners (VMs or containers, depending on
the executor) than `--max-runners` allows; extra jobs queue until a slot
frees up.

```bash
export CIRUN_API_TOKEN=YOUR_TOKEN
cirun-agent --max-runners 5
```

Defaults:
- **macOS**: `2` (Apple Virtualization framework caps concurrent VMs at 2 on
  most Apple Silicon hardware).
- **Linux**: unlimited — set this explicitly to match your host's CPU/RAM.

Re-install the service after changing the flag so the new limit is picked up:

```bash
export CIRUN_API_TOKEN=YOUR_TOKEN
sudo -E cirun-agent --install-service --max-runners 5   # Linux
cirun-agent --install-service --max-runners 5           # macOS
```

### Zero-latency jobs with [idle runners](./reference/idle_runners.md)

Cloud runners take a couple of minutes to provision, but on-prem runners
provision in seconds — and even those seconds disappear if you keep a
warm pool with [`idle:`](./reference/idle_runners.md). An idle runner is
already booted and registered with GitHub, so a job picks it up instantly.

```yml
runners:
  - name: cirun-macos-runner
    cloud: on_prem
    instance_type: 8vcpu-8gb-100gb
    machine_image: "cirunlabs/macos-sequoia-xcode:16.4"
    region: RegionOne
    labels:
      - cirun-macos-runner
    idle:
      replicas: 2
```

Keep `replicas` ≤ `--max-runners` (otherwise the idle pool can't reach its
target). When using idle runners, drop the `--${{ github.run_id }}` suffix
on `runs-on` — see [Idle Runners](./reference/idle_runners.md) for full
details and time-windowed schedules.
