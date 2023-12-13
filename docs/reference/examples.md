---
id: examples
description: Cirun.yml Examples
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Examples, Cloud Platform, Runners]
---

# Cirun.yml Examples

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Docs" />
  <meta name="twitter:description" content="Cirun.yml Examples" />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

## Google Cloud Platform

```yml
# Self-Hosted Github Action Runners on GCP via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml
runners:
  - name: "gpu-runner"
    # Cloud Provider: GCP
    cloud: "gcp"
    # Cheapest GPU on GCP
    gpu: "nvidia-tesla-t4"
    # Cheapest VM on GCP, with GPU attachable
    instance_type: "n1-standard-1"
    # Ubuntu-20.4, can be seen from "gcloud compute images list"
    machine_image: "ubuntu-2004-focal-v20221018"
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-gpu-runner"
```

- In your GitHub Workflow (e.g. `.github/workflows/<workflow-name>.yml`)

```yml
  runs-on: "cirun-gpu-runner--${{ github.run_id }}"
```

## DigitalOcean

```yml
# Self-Hosted Github Action Runners on DigitalOcean via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml
runners:
  - name: "do-runner"
    # Cloud Provider: DigitalOcean
    cloud: "digitalocean"
    # Cheapest VM on DigitalOcean
    instance_type: "s-1vcpu-1gb"
    # Ubuntu-20.4  image"
    machine_image: "ubuntu-20-04-x64"
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-do-runner"
```

- In your GitHub Workflow (e.g. `.github/workflows/<workflow-name>.yml`)

```yml
  runs-on: "cirun-do-runner--${{ github.run_id }}"
```

## Amazon Web Services

```yml
# Self-Hosted Github Action Runners on AWS via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml
runners:
  - name: "aws-runner"
    # Cloud Provider: AWS
    cloud: "aws"
    # Cheapest VM on AWS
    instance_type: "t2.nano"
    # Ubuntu-20.4, ami image
    machine_image: "ami-06fd8a495a537da8b"
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-aws-runner"
```

- In your GitHub Workflow (e.g. `.github/workflows/<workflow-name>.yml`)

```yml
  runs-on: "cirun-aws-runner--${{ github.run_id }}"
```

## Azure

```yml
# Self-Hosted Github Action Runners on Azure via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml
runners:
  - name: "azure-runner"
    # Cloud Provider: Azure
    cloud: "azure"
    instance_type: "Standard_DS1_v2"
    # Takes 4 parameters (publisher:offer:sku:version)
    machine_image: "canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2:latest"
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-azure-runner"
```

- In your GitHub Workflow (e.g. `.github/workflows/<workflow-name>.yml`)

```yml
  runs-on: "cirun-azure-runner--${{ github.run_id }}"
```

## Openstack

```yml
# Self-Hosted Github Action Runners on Openstack via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml
runners:
  - name: "openstack-runner"
    # Cloud Provider: Openstack
    cloud: "openstack"
    # Instance type refers to flavors in openstack
    instance_type: "m1.small"
    # By default openstack provides cirros image
    # To build custom image check the custom image docs
    # This image is not suitable for jobs to be performed by runner, refer to custom image docs and create a new image first
    machine_image: "cirros-0.5.2-x86_64-disk"
    # preemptible instances not supported
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-openstack-runner"
```

- In your GitHub Workflow (e.g. `.github/workflows/<workflow-name>.yml`)

```yml
  runs-on: "cirun-openstack-runner--${{ github.run_id }}"
```

## Oracle Cloud

```yml
# Self-Hosted Github Action Runners on Oracle Cloud via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml
runners:
  - name: "oracle-runner"
    # Cloud Provider: Oracle
    cloud: "oracle"
    instance_type: "VM.Standard.E2.1.Micro"
    # OCID of the Machine image
    machine_image: "ocid1.image.oc1.uk-london-1.aaaaaaaavy5v3inu2ho2h57vwvvsclukdh4jvhg45um2nrejyxa7s46zcwoq"
    region: "uk-london-1"
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-oracle-runner"
```

- In your GitHub Workflow (e.g. `.github/workflows/<workflow-name>.yml`)

```yml
  runs-on: "cirun-oracle-runner--${{ github.run_id }}"
```
