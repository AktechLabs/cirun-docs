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

It contains the spec for the runners that will be spun on each commit.

```yml
runners:
  - name: gpu-runner
    cloud: gcp
    gpu: nvidia-tesla-t4
    instance_type: n1-standard-1
    machine_image: ubuntu-minimal-2004-lts
    preemptible: true
    labels:
      - cirun-gpu-runner
```

### Name: `name`

Name of the runner.

### Cloud: `cloud`

Name of the cloud provider, here are the possible options:

- Google Cloud Platform

```yml
cloud: gcp
```

- Amazon Web Services

```yml
cloud: aws
```

- DigitalOcean

```yml
cloud: do
```

- Azure

```yml
cloud: azure
```

- Openstack

```yml
cloud: openstack
```

- Oracle

```yml
cloud: oracle
```

### GPU: `gpu`

Name of the GPU if runner is required with a GPU. See Cloud provider's
documentation for `gpu` names.

```yml
gpu: nvidia-tesla-t4
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
instance_type: n1-standard-1  # For GCP
```

```yml
instance_type: t3.nano  # For AWS
```

```yml
instance_type: s-1vcpu-1gb  # For DigitalOcean
```

```yml
instance_type: Standard_DS1_v2  # For Azure
```

```yml
instance_type: m1.small  # For Openstack
```

### Machine Image: `machine_image`

The OS image for the runner.

#### GCP

GCP supports two types of images with multiple format options:

**Custom Images** (disk images created from instances or uploaded):
```yml
# Simple name (searches in ubuntu-os-cloud project by default)
machine_image: ubuntu-minimal-2004-lts

# Project-scoped format (project:image) - recommended for custom images
machine_image: "my-project:my-custom-image"

# Full projects path
machine_image: "projects/my-project/global/images/my-custom-image"

# HTTP self-link URL
machine_image: "https://www.googleapis.com/compute/v1/projects/my-project/global/images/my-image"
```

**Machine Images** (snapshots of entire VM instances including attached disks):
```yml
# Project-scoped format (project:image)
machine_image: "my-project:my-machine-image"

# Full projects path
machine_image: "projects/my-project/global/machineImages/my-machine-image"

# HTTP self-link URL
machine_image: "https://www.googleapis.com/compute/beta/projects/my-project/global/machineImages/my-machine-image"
```

#### AWS

Amazon Machine image ID

```yml
machine_image: ami-06fd8a495a537da8b
```

#### DigitalOcean

Slug of the machine image, can be obtained from DigitalOcean CLI via:
`doctl compute image list --public`

```yml
machine_image: ubuntu-20-04-x64
```

#### Azure

Machine image takes 4 parameters(publisher, offer, sku, version) for available images on Azure. For custom images, it takes only one parameter(id). Images can be obtained from Azure CLI via:
`az vm image list --output table`

```yml
machine_image:
  publisher: Canonical
  offer: UbuntuServer
  sku: "18.04-LTS"
  version: latest
```

#### Openstack

In OpenStack cloud by default you are provided with cirros image, you can also build your custom image and use them. You can see all your images in the dashboard or can also use the OpenStack CLI command `openstack image list`.

```yml
machine_image: cirros-0.5.2-x86_64-disk
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
region: us-central1-b  # Zone for GCP
```

### Labels: `labels`

Add label(s) to your runner definition, so that you can add the same or subset of
these labels in the "runs-on" param in .github/workflows/<workflow-name />.yml
So that this runner is created for running the workflow.

```yml
labels:
  - cirun-runner
  - cirun-gpu-runner
```

:::note Labels
Labels must start with prefix `cirun-`

:::

## Extra configuration: `extra_config`

This section is specific to the cloud provider and can be used to add extra configuration for the runner.

### AWS Extra Configuration

#### Custom Disk Size for AWS

To customize the root volume size for runners spun up on AWS:

```yml
    extra_config:
      BlockDeviceMappings:
        - DeviceName: /dev/sda1
          VolumeSize: 75
          VolumeType: gp2
```

### GCP Extra Configuration

#### Custom Disk Size for GCP

To customize the root volume size for runners spun up on GCP:

```yml
    extra_config:
      baseDisk:
        diskSizeGb: 101
      additionalDisk:
        diskSizeGb: 42
        diskType: "projects/<PROJECT-ID>/zones/<ZONE>/diskTypes/pd-balanced"
      existingDisk:
        deviceName: <DEVICE-NAME>
        diskSizeGb: 122
        source: "projects/<PROJECT-ID>/regions/<ZONE>/disks/<DISK-NAME>"
        type: PERSISTENT
        mode: READ_WRITE
        interface: SCSI
```

#### Project for GCP

To customize the project to deploy the runner in GCP, you can set the project id in the `extra_config` section.
The default `project_id` is the project id of the service account you have provided in the credentials on cirun
dashboard.

```yml
    extra_config:
      project_id: my-project-id
```

#### Network Interfaces for GCP

Custom network configuration for GCP instances. This is particularly important for certain instance types.

```yml
    extra_config:
      networkInterfaces:
        - network: "global/networks/default"
          accessConfigs:
            - type: ONE_TO_ONE_NAT
              name: "External NAT"
              networkTier: PREMIUM
```

**GVNIC Network Interface (Required for third-generation machine types: C3, N2, N2D, T2A):**

```yml
    extra_config:
      networkInterfaces:
        - nicType: GVNIC
          network: "global/networks/default"
          accessConfigs:
            - type: ONE_TO_ONE_NAT
              name: "External NAT"
              networkTier: PREMIUM
          stackType: IPV4_ONLY
          subnetwork: "projects/<PROJECT-ID>/regions/<REGION>/subnetworks/<SUBNET-NAME>"
```

#### Custom Images and GVNIC

:::note
When using third-generation machine types (C3, N2, N2D, T2A) or Confidential VM instances, your custom image must be created with the GVNIC guest OS feature. This is done during image creation with:

```bash
gcloud compute images create my-image --source-disk=my-disk --guest-os-features=GVNIC
```

To check if an existing image has the GVNIC feature:

```bash
gcloud compute images describe my-image --project=my-project --format="value(guestOsFeatures[].type)"
```

Additionally, you must configure GVNIC network interface in your runner configuration as shown above.

See [Using gVNIC](https://cloud.google.com/compute/docs/networking/using-gvnic) and [Machine Types](https://cloud.google.com/compute/docs/machine-resource#machine_type_comparison) for more details.
:::

#### Service Accounts for GCP

Configure service accounts for the instance.

```yml
    extra_config:
      serviceAccounts:
        - email: "my-service-account@my-project.iam.gserviceaccount.com"
          scopes:
            - "https://www.googleapis.com/auth/cloud-platform"
            - "https://www.googleapis.com/auth/compute"
```

### Azure Extra Configuration

#### Custom Disk Size for Azure

To customize the root volume size for runners spun up on Azure:

```yml
    extra_config:
      storageProfile:
        osDisk:
          diskSizeGB: 512
```

#### Enable public IP address for Azure

This will enable provisioning of public ip address on VMs created on Azure.

```yml
    extra_config:
      enable_public_ip: true
```

### General Extra Configuration

#### Custom Provisioning

This is used to control how the runner is provisioned, for example, you can create a custom image that runs
a custom startup script on the vm startup and then pull the runner provisioning script from cirun's API and run it,
instead of cirun just running the provisioning script on startup. This gives you more control over the
provisioning process and run custom scripts on the runner startup, before the runner is ready to run the workflows.

```yml
    extra_config:
      provision_via: pull_from_api
```

To pull the provisioning script from cirun's API, you need to set the `provision_via` to `pull_from_api` in your
`.cirun.yml` file and then you need to call the API in your startup script to get the provisioning script.

The API endpoint is `/api/runner-provision?runner_name=<runner_name>` and it returns the provisioning script.
You would need to call this API with cirun's API token in the header. The runner name is available in the
runner tags in the runner's metadata in the key "Name".

#### Interactive Runner on Windows

Cirun supports interactive runners on Windows for use cases such as:

- Desktop GUI-based testing
- QA workflows
- Workloads that require an active session

This will start the runner in an interactive desktop session (instead of a headless background service),
making it suitable for tools that require a GUI.

```yml
    extra_config:
      run_as: interactive
```

#### Custom Runner User on Windows

Specifies the Windows user account to run the GitHub Actions runner under.

```yml
    extra_config:
      runner_user: runner
```

#### Custom Runner Path on Windows

Overrides the default runner installation path on Windows.

```yml
    extra_config:
      runner_path: "C:\\r"
```
