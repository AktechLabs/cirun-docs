---
sidebar_position: 1
id: aws
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---

# Amazon Web Services

```yml
# Self-Hosted Github Action Runners on AWS via Cirun.io
# Reference: https://docs.cirun.io/Reference/yml.html
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