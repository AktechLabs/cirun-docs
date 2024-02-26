---
id: windows
description: Cirun Documentation - Windows Runner.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Windows, ]
---

# Windows

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Documentation" />
  <meta name="twitter:description" content="Cirun Documentation - Custom Images for Runner." />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

You can use windows operating system for your runners as well. Here are a couple of examples
of creating windows runner on Azure and AWS:

## Azure

:::note

The spinup time of windows runners on Azure is higher than AWS.

:::

```yaml
runners:
  - name: "azure-windows-runner"
    cloud: "azure"
    region: "uksouth"
    instance_type: "Standard_D2s_v3"
    machine_image:
      publisher: microsoftwindowsdesktop
      offer: windows-11
      sku: win11-22h2-pro
      version: latest
    labels:
      - "cirun-azure-windows-runner"
```


## AWS

```yaml
runners:
  - name: "aws-windows-runner"
    cloud: "aws"
    region: "us-east-1"
    instance_type: "t2.medium"
    machine_image: "ami-0f9c44e98edf38a2b"
    labels:
     - "cirun-aws-windows-runner"
```
