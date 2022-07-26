# Cirun.yml Examples

## GCP

```yaml
# Self-Hosted Github Action Runners on GCP via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: gpu-runner
    # Cloud Provider: GCP
    cloud: gcp
    # Cheapest GPU on GCP
    gpu: nvidia-tesla-t4
    # Cheapest VM on GCP, with GPU attachable
    instance_type: n1-standard-1
    # Ubuntu-20.4, can be seen from "gcloud compute images list"
    machine_image: ubuntu-minimal-2004-lts
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - cirun-gpu-runner
```

## DigitalOcean

```yaml
# Self-Hosted Github Action Runners on DigitalOcean via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: do-runner
    # Cloud Provider: DigitalOcean
    cloud: digitalocean
    # Cheapest VM on DigitalOcean
    instance_type: s-1vcpu-1gb
    # Ubuntu-20.4  image"
    machine_image: ubuntu-20-04-x64
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - cirun-do-runner
```

## AWS

```yaml
# Self-Hosted Github Action Runners on AWS via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: aws-runner
    # Cloud Provider: AWS
    cloud: aws
    # Cheapest VM on AWS
    instance_type: t2.nano
    # Ubuntu-20.4, ami image
    machine_image: ami-06fd8a495a537da8b
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - cirun-aws-runner
```

## Azure

```yaml
# Self-Hosted Github Action Runners on Azure via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: azure-runner
    # Cloud Provider: Azure
    cloud: azure
    instance_type: Standard_DS1_v2
    # Takes 4 parameters (publisher:offer:sku:version)
    machine_image: Canonical:UbuntuServer:18.04-LTS:latest
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - cirun-azure-runner
```

## Openstack

```yaml
# Self-Hosted Github Action Runners on Openstack via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: openstack-runner
    # Cloud Provider: Openstack
    cloud: openstack
    # Instance type refers to flavors in openstack
    instance_type: m1.small
    # By default openstack provides cirros image
    # To build custom image check the custom image docs
    # This image is not suitable for jobs to be performed by runner, refer to custom image docs and create a new image first
    machine_image: cirros-0.5.2-x86_64-disk
    # preemptible instances not supported
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - cirun-openstack-runner
```
