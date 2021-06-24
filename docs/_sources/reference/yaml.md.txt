# Cirun.yml

API documentation for Cirun.yml file.

## Runners: `runners`

It containers the spec for the runners that will be spun on each commit.

```yaml
runners:
  - name: gpu-runner
    cloud: gcp
    gpu: nvidia-tesla-t4
    instance_type: n1-standard-1
    machine_image: ubuntu-minimal-2004-lts
    preemptible: true
    workflow: .github/workflows/test.yml
    count: 2

```

### Name: `name`

Name of the runner.

### Cloud: `cloud`

Name of the cloud provider, here are the possible options:

* Google Cloud Platform

```yaml
cloud: gcp
```

* Amazon Web Services

```yaml
cloud: aws
```

* DigitalOcean

```yaml
cloud: do
```

### GPU: `gpu`

Name of the GPU if runner is required with a GPU. See Cloud provider's
documentaion for `gpu` names.

```yaml
gpu: nvidia-tesla-t4
```

### Instance Type: `instance_type`

Name of the instance depending on the cloud provider.

```yaml
instance_type: n1-standard-1  # For GCP
```

```yaml
instance_type: t3.nano  # For AWS
```

```yaml
instance_type: s-1vcpu-1gb  # For DigitalOcean
```

### Machine Image: `machine_image`

The OS image for the runner.

#### GCP

It can be seen from "gcloud compute images list"

```yaml
machine_image: ubuntu-minimal-2004-lts
```

#### AWS

Amazon Machine image ID

```yaml
machine_image: ami-06fd8a495a537da8b
```

#### DigitalOcean

Slug of the machine image, can be obtained from DigitalOcean CLI via:
`doctl compute image list --public`

```yaml
machine_image: ubuntu-20-04-x64
```


### Preemptible: `preemptible`

Option to chose low cost instances, also knows as preemptible in GCP and Spot in AWS, default is `false`.
This is not applicable for DigitalOcean as they don't support preemptible instances.

```yaml
preemptible: true
```

### Region: `region`

Region to spin up runners in your cloud account.

```yaml
region: us-central1-b  # Example for GCP
```

### Workflow: `workflow`

Path of the relevant workflow for this runner.

```yaml
workflow: .github/workflows/test.yml
```

### Count: `count`

Number of instance to spin up on every commit for the given runner spec, default is `1`.
This is useful when you have a matrix in a workflow to run multiple jobs at once.

```yaml
count: 2
```
