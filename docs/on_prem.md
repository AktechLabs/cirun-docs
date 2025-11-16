---
sidebar_position: 3
id: on-prem
description: Cirun Documentation - On Premise
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, on-premise, Apple Silicon, Mac Mini, Mac Pro, Linux, KVM, Cirun-agent]
---

# On Premise

Cirun supports spinning up runners on your own infrastructure. Currently supported platforms:
- **macOS**: Apple Silicon Macs (Mac Mini, Mac Pro, MacBook)
- **Linux**: x86_64 Linux with KVM support

The setup is simple and can be done in a few minutes. You need to install cirun-agent on your machine,
which will connect to Cirun's API to spin up on-demand ephemeral VMs for GitHub Actions.

## Setting up `cirun-agent`

1. Create an API token on the [Cirun Dashboard](https://cirun.io/admin/api)

2. Install the [cirun-agent](https://github.com/cirunlabs/cirun-agent):

    ```bash
    curl --proto '=https' --tlsv1.2 -LsSf https://raw.githubusercontent.com/cirunlabs/cirun-agent/refs/heads/main/install.sh | sh
    ```

3. Install and start as a system service (recommended):

    ```bash
    # Linux (requires sudo)
    sudo cirun-agent --api-token <API_TOKEN> --install-service

    # macOS
    cirun-agent --api-token <API_TOKEN> --install-service
    ```

    The service will start automatically on boot and restart on failure.

    **Alternative**: Run manually in the background:
    ```bash
    cirun-agent --api-token <API_TOKEN> &
    ```

4. Create a `.cirun.yml` file in your repository:

    **For macOS:**
    ```yml
    runners:
      - name: cirun-macos-runner
        cloud: on_prem
        instance_type: 8vcpu-8gb-51gb
        machine_image: "cirunlabs/macos-sequoia-runner:latest"
        region: RegionOne
        labels:
          - cirun-macos-runner
    ```

    **For Linux:**
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

5. Configure your workflow to use the runner:

    ```yml
    runs-on: cirun-linux-runner--${{ github.run_id }}
    ```

    Make sure you have installed the Cirun GitHub App and marked the repository as active on the
    [Cirun Dashboard](https://cirun.io/admin/repositories).
