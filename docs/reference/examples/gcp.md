---
sidebar_position: 4
id: gcp
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---

# Google Cloud Platform

```yml
# Self-Hosted Github Action Runners on GCP via Cirun.io
# Reference: https://docs.cirun.io/Reference/yml.html
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