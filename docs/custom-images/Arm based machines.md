---
id: arm-based-machines
description: Overview on how to use Cirun.io for Arm based machines
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Arm based machines, yaml]
---

# Arm based machines

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Documentation" />
  <meta name="twitter:description" content="Overview on how to use Cirun.io for Arm based machines" />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

Cirun also supports arm based machines.

Here is an example of an arm based machine on AWS:

```yml
runners:
  - name: "aws-cpu-arm-runner"
    cloud: "aws"
    instance_type: "a1.medium"
    # AMI for ubuntu/images/hvm-ssd/ubuntu-focal-20.04-arm64-server
    machine_image: "ami-0229f8cfc24033d05"
    preemptible: false
    labels:
      - "cirun-arm-runner"
```
