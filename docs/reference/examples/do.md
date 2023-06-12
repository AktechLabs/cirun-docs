---
sidebar_position: 3
id: do
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---
# DigitalOcean

```yml
# Self-Hosted Github Action Runners on DigitalOcean via Cirun.io
# Reference: https://docs.cirun.io/Reference/yml.html
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