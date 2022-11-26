---
id: yaml
description: API documentation for Cirun.yml file.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Runners, Fallback_runners, Yaml runners]
---

# Cirun configuration

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Documentation" />
  <meta name="twitter:description" content="API documentation for Cirun.yml file." />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

File: `.cirun.yml`

API documentation for Cirun.yml file.

## Runners: `runners`

It containers the spec for the runners that will be spun on each commit.

```yml
runners:
  - name: "gpu-runner"
    cloud: "gcp"
    gpu: "nvidia-tesla-t4"
    instance_type: "n1-standard-1"
    machine_image: "ubuntu-minimal-2004-lts"
    preemptible: true
    labels:
      - "cirun-gpu-runner"
```

### Name: `name`

Name of the runner.

### Cloud: `cloud`

Name of the cloud provider, here are the possible options:

- Google Cloud Platform

```yml
cloud: "gcp"
```

- Amazon Web Services

```yml
cloud: "aws"
```

- DigitalOcean

```yml
cloud: "do"
```

- Azure

```yml
cloud: "azure"
```

- Openstack

```yml
cloud: "openstack"
```

### GPU: `gpu`

Name of the GPU if runner is required with a GPU. See Cloud provider's
documentation for `gpu` names.

```yml
gpu: "nvidia-tesla-t4"
```

:::note
This flag also installs nvidia-drivers in the given VM
:::

:::note
For using GPUs on AWS, we recommend using **NVIDIA Deep Learning AMI** from AWS
Marketplace. See the Custom Images section for the documentation on how to use
that. Also note this flag is not required for **NVIDIA Deep Learning AMI** image
on AWS.
:::

### Instance Type: `instance_type`

Name of the instance depending on the cloud provider.

```yml
instance_type: "n1-standard-1"  # For GCP
```

```yml
instance_type: "t3.nano"  # For AWS
```

```yml
instance_type: "s-1vcpu-1gb"  # For DigitalOcean
```

```yml
instance_type: "Standard_DS1_v2"  # For Azure
```

```yml
instance_type: "m1.small"  # For Openstack
```

### Machine Image: `machine_image`

The OS image for the runner.

#### GCP

It can be seen from "gcloud compute images list"

```yml
machine_image: "ubuntu-minimal-2004-lts"
```

#### AWS

Amazon Machine image ID

```yml
machine_image: "ami-06fd8a495a537da8b"
```

#### DigitalOcean

Slug of the machine image, can be obtained from DigitalOcean CLI via:
`doctl compute image list --public`

```yml
machine_image: "ubuntu-20-04-x64"
```

#### Azure

Machine image takes 4 parameters(publisher, offer, sku, version) for available images on Azure. For custom images, it takes only one parameter(id). Images can be obtained from Azure CLI via:
`az vm image list --output table`

```yml
machine_image:
  publisher: "Canonical"
  offer: "UbuntuServer"
  sku: "18.04-LTS"
  version: "latest"
```

#### Openstack

In OpenStack cloud by default you are provided with cirros image, you can also build your custom image and use them. You can see all your images in the dashboard or can also use the OpenStack CLI command `openstack image list`.

```yml
machine_image: "cirros-0.5.2-x86_64-disk"
```

### Preemptible: `preemptible`

Option to chose low cost instances, also knows as preemptible in GCP and Spot in AWS, default is `false`.
This is not applicable for DigitalOcean and Openstack as they don't support preemptible instances.

```yml
preemptible: true
```

### Region: `region`

Region to spin up runners in your cloud account.

```yml
region: "us-central1-b"  # Example for GCP
```

### Labels: `labels`

Add label(s) to your runner definition, so that you can add the same or subset of
these labels in the "runs-on" param in .github/workflows/<workflow-name />.yml
So that this runner is created for running the workflow.

```yml
labels:
  - "cirun-runner"
  - "cirun-gpu-runner"
```

:::note Labels
Labels must start with prefix `cirun-`

:::

### Workflow: `workflow` (DEPRECATED)

This param is deprecated and not recommended for use. Please use `labels` parameter
to match workflow with a runner configuration.

Path of the relevant workflow for this runner.

```yml
workflow: ".github/workflows/test.yml"
```

### Run workflow when triggered by a team member: `run_only_when_triggered_by`

Run the workflow job only when the workflow was triggered (or committed) by a user of the
mentioned team. In other words Cirun will spin up machine only when the workflow is requested
by a member of the team and will cancel the workflow otherwise.

The team is a group of users in an organization, read more about it here:
[https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams)

```yml
run_only_when_triggered_by: "my-awesome-github-organisation-team"
```

:::note Organization wide settings priority
For organizations, this setting can be controlled organization wide as well.

This setting can be overriden by the `.cirun.global.yml` config in the organization. In
other words the configuration value for `run_only_when_triggered_by` in the
`.cirun.global.yml` (in the repository named `.cirun`: `<org_name>/.cirun/.cirun.global.yml`) will take
priority over repository setting (in `.cirun.yml`).

:::

# Cirun Global Configuration

File: `.cirun.global.yml`

API documentation for `.cirun.global.yml` file. This is for organization wide settings/configuration.

To create global organization wide settings:

- create a repo named `.cirun` in the organization and then create
- a file named `.cirun.global.yml` in that repo.

Below is the API documentation for available global settings/configurations.

## Global configuration: `.cirun.global.yml`

### Run workflow when triggered by a team member: `run_only_when_triggered_by`

Run any workflow job only when the workflow was triggered (or committed) by a user of the
mentioned team. In other words Cirun will spin up machine only when the workflow is requested
by a member of the team and will cancel the workflow otherwise.

The team is a group of users in an organization, read more about it here:
[https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams](https://docs.github.com/en/organizations/organizing-members-into-teams/about-teams)

```yml
run_only_when_triggered_by: "my-awesome-github-organisation-team"
```
