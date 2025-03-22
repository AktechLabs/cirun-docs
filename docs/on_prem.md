---
sidebar_position: 3
id: on-prem
description: Cirun Documentation - On Premise
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, on-premise, Apple Silicon, Mac Mini, Mac Pro, Cirun-agent]
---

# On Premise

Cirun also supports spinning up runners on your own infrastructure. At the moment only
Apple Silicon Macs are supported. If you have a Mac Mini or a Mac Pro with Apple Silicon
then you can use Cirun to run your GitHub Actions on your own infrastructure. Support for linux
and windows for on-prem is coming soon.

## Setting up cirun-agent on Apple Silicon Mac

1. Create an API token on the [Cirun Dashboard](https://cirun.io/admin/api)
2. Install the [cirun-agent](https://github.com/cirunlabs/cirun-agent) by running the following command:

    ```bash
    curl --proto '=https' --tlsv1.2 -LsSf https://github.com/aktechlabs/cirun-agent/releases/download/v0.2.4/cirun-agent-installer.sh | sh
    ```
3. Start the agent by running the following command:

    ```bash
    cirun-agent --api-token <API_TOKEN> &
    ```

4. Create a `.cirun.yml` file in your repository with the following content:

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

Now you can push to your repository and your actions will run on your Apple Silicon Mac, assuming you have a workflow file with `runs-on: cirun-macos-runner-${{ github.run_id }}`.
