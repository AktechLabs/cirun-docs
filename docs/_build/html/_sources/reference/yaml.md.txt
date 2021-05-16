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
    machine_image: https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/ubuntu-minimal-2004-focal-v20210429
    preemptible: true
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

* DigitalOCcean

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
instance_type: n1-standard-1
```

### Machine Image: `machine_image`

The OS image for the runner.

```yaml
machine_image: https://www.googleapis.com/compute/v1/projects/ubuntu-os-cloud/global/images/ubuntu-minimal-2004-focal-v20210429
```
### Preemptible: `preemptible`

Option to chose low cost instances, also knows as preemptible in GCP and Spot in AWS, default is `false`.

```yaml
preemptible: true
```

### Count: `count`

Number of instance to spin up on every commit for the given runner spec, default is `1`.

```yaml
count: 2
```
