---
sidebar_position: 2
id: azure
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---
# Azure

```yml
# Self-Hosted Github Action Runners on Azure via Cirun.io
# Reference: https://docs.cirun.io/Reference/yml.html
runners:
  - name: "azure-runner"
    # Cloud Provider: Azure
    cloud: "azure"
    instance_type: "Standard_DS1_v2"
    # Takes 4 parameters (publisher:offer:sku:version)
    machine_image: "Canonical:UbuntuServer:18.04-LTS:latest"
    preemptible: false
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-azure-runner"
```