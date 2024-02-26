---
id: organization-runner-configuration
description: Organization Runner Configuration
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Examples, Cloud Platform, Runners]
---

# Organization Runners Config

When using cirun.io in an organization on multiple repositories, quite often it is the case
that you have similar `.cirun.yml` files across multiple repositories. To solve this problem,
cirun provides a way to define global cirun configuration at organization level, such that
you define all the configuration at one place and you can use that in all the repositories.

To use this feature you'd create a repository named `.cirun` in your organization
and create a global configuration file named `.cirun.global.yml` in the root directory,
like the following:


### `.cirun.global.yml`

This is the file where you will define all the runner configurations you would
want to use in the various GitHub Actions workflows in various repositories
in the organization. The format of this file is same as `.cirun.yml`, for example:


```yaml
runners:
  - name: aws-gpu-runner
    cloud: aws
    instance_type: g4dn.xlarge
    machine_image: ami-0939f4afb89c09aa1
    labels:
      - cirun-aws-gpu

  - name: aws-cpu-runner-pass
    cloud: aws
    instance_type: t2.small
    machine_image: ami-06fd8a495a537da8b
    labels:
      - cirun-aws-cpu

  - name: aws-cpu-arm-runner
    cloud: aws
    instance_type: a1.medium
    machine_image: ami-0229f8cfc24033d05
    labels:
      - cirun-aws-cpu-arm

  - name: aws-multiple-runner
    cloud: aws
    instance_type: t2.small
    machine_image:
      - ami-06fd8a495a537da8b
      - ami-06fd8a495a537da8b
      - ami-06fd8a495a537da8b
      - ami-06fd8a495a537da8b
      - ami-06fd8a495a537da8b
    region:
      - sa-east-1
      - me-south-1
      - eu-north-1
      - eu-west-1
      - eu-north-1
    labels:
      - cirun-aws-multiple-runner

  - name: gcp-gpu-custom-machine-runner
    cloud: gcp
    gpu: nvidia-tesla-t4
    instance_type: n1-standard-1
    machine_image: cirun-labs:cirun-nvidia
    labels:
      - cirun-gcp-gpu-custom-machine

  - name: gcp-cpu-runner
    cloud: gcp
    instance_type: n1-standard-1
    machine_image: ubuntu-2004-focal-v20220712
    labels:
      - cirun-gcp-cpu

  - name: do-runner
    cloud: digitalocean
    instance_type: s-1vcpu-1gb
    machine_image: ubuntu-20-04-x64
    labels:
      - cirun-do

  - name: azure-cpu-runner
    cloud: azure
    instance_type: Standard_DS1_v2
    machine_image: Canonical:UbuntuServer:18.04-LTS:latest
    labels:
      - cirun-azure-cpu

  - name: azure-gpu-runner
    cloud: azure
    instance_type: Standard_NC4as_T4_v3
    machine_image: nvidia:ngc_azure_17_11:ngc-base-version-22_03_0-gen2:latest
    region: southeastasia
    labels:
      - cirun-azure-gpu

  - name: azure-cpu-runner-spotinstance
    cloud: azure
    instance_type: Standard_DS1_v2
    machine_image: Canonical:UbuntuServer:18.04-LTS:latest
    preemptible: true
    labels:
      - cirun-azure-cpu-spot

  - name: oracle-runner
    cloud: oracle
    instance_type: VM.Standard.E2.1.Micro
    machine_image: ocid1.image.oc1.uk-london-1.aaaaaaaavy5v3inu2ho2h57vwvvsclukdh4jvhg45um2nrejyxa7s46zcwoq
    region: uk-london-1
    labels:
      - cirun-oracle-cpu

  - name: aws-windows-runner
    cloud: aws
    region: us-east-1
    instance_type: t2.medium
    machine_image: ami-0f9c44e98edf38a2b
    preemptible: true
    labels:
      - cirun-aws-windows-runner

  - name: azure-windows-runner
    cloud: azure
    region: uksouth
    instance_type: Standard_D2s_v3
    machine_image: "microsoftwindowsdesktop:windows-11:win11-22h2-pro:latest"
    labels:
      - cirun-azure-windows-runner

  - name: azure-custom-image-runner
    cloud: azure
    region: uksouth
    instance_type: Standard_D2s_v3
    machine_image: "/subscriptions/7b9d1535-2655-4887-a82c-accb37d605a8/resourceGroups/ubuntu-cimage/providers/Microsoft.Compute/images/ubuntu-cimage-image-20240226023350"
    labels:
      - cirun-azure-custom-image-runner
```


Now in your repositories github workflow files you can use refer the labels from the globa
config defined in the `.cirun` repository, for example:

```yaml
runs-on: "azure-custom-image-runner--${{ github.run_id }}"
```
