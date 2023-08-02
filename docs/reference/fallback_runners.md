---
id: fallback-runners
description: Spinup alternate runners in case of unavailability
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Fallback, Runners, labels, No runners]
---

# Fallback Runners in case of unavailability

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Documentation" />
  <meta name="twitter:description" content="No Runner matching labels." />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

It might happen sometimes that the runner creation fails even though
you've got the right configuration. One of the major reasons for this
could be that the instance type you've asked from your cloud provider
is having some availability issues.

This issue is most common with preemptible (spot for AWS) and GPU instances.

To cater to this problem we've implemented a way for you to specify a
list of fallback runners to try for and here are some examples for the
same:

## Configuration

To create fallback/retry/failsafe runners, you can provide the following
parameters in the `.cirun.yml` as list, and then we'll create a matrix of
configurations to try creating a runner for:

- `instance_type`
- `machine_image`
- `region`
- `preemptible`

Below are some examples are corresponding runners that will be tried
to be created for a job one by one if the previous one failed.

## Example #1

This example depicts the following configuration:

- Single Cloud
- Single Instance Type
- Multiple Regions and Machine Image

```yml
runners:
- name: "aws-multiple-runner"
  cloud: "aws"
  instance_type: "t2.nano"
  machine_image:
    - "ami-for-sa-east-1"
    - "ami-for-me-south-1"
    - "ami-for-eu-north-1"
    - "ami-for-eu-west-1"
    - "ami-for-eu-north-1"
  region:
    - "sa-east-1"
    - "me-south-1"
    - "eu-north-1"
    - "eu-west-1"
    - "eu-north-1"
  labels:
    - "cirun-multiple-runner-options"
```

This would try for the following instance configuration in the given order:

```yml
instance_type: "t2.nano"
machine_image: "ami-for-sa-east-1"
region: "sa-east-1"
```

```yml
instance_type: "t2.nano"
machine_image: "ami-for-me-south-1"
region: "me-south-1"
```

```yml
instance_type: "t2.nano"
machine_image: "ami-for-eu-north-1"
region: "eu-north-1"
```

```yml
instance_type: "t2.nano"
machine_image: "ami-for-eu-west-1"
region: "eu-west-1"
```

```yml
instance_type: "t2.nano"
machine_image: "ami-for-eu-north-1"
region: "eu-north-1"
```

## Example #2

This example depicts the following configuration:

- Multiple Cloud
- Multiple Instance Type
- Multiple Regions and Machine Image

```yml
runners:
- name: "aws-multiple-runner"
  cloud: "aws"
  instance_type:
    - "t2.nano"
    - "t2.micro"
    - "t2.small"
    - "t2.medium"
    - "t2.large"
  machine_image:
    - "ami-for-sa-east-1"
    - "ami-for-me-south-1"
    - "ami-for-eu-north-1"
    - "ami-for-eu-west-1"
    - "ami-for-eu-north-1"
  region:
    - "sa-east-1"
    - "me-south-1"
    - "eu-north-1"
    - "eu-west-1"
    - "eu-north-1"
  labels:
    - "cirun-multiple-runner-options"


- name: "gcp-multiple-runner"
  cloud: "gcp"
  instance_type:
    - "instance-type-1"
    - "instance-type-2"
    - "instance-type-3"
    - "instance-type-4"
    - "instance-type-5"
  machine_image:
    - "image-for-gcp-region-1"
    - "image-for-gcp-region-2"
    - "image-for-gcp-region-3"
    - "image-for-gcp-region-4"
    - "image-for-gcp-region-5"
  region:
    - "gcp-region-1"
    - "gcp-region-2"
    - "gcp-region-3"
    - "gcp-region-4"
    - "gcp-region-5"
  labels:
    - "cirun-multiple-runner-options"
```

This would try for the following instance configuration in the given order:

```yml
instance_type: "t2.nano"
machine_image: "ami-for-sa-east-1"
region: "sa-east-1"
```

```yml
instance_type: "t2.micro"
machine_image: "ami-for-me-south-1"
region: "me-south-1"
```

```yml
instance_type: "t2.small"
machine_image: "ami-for-eu-north-1"
region: "eu-north-1"
```

```yml
instance_type: "t2.medium"
machine_image: "ami-for-eu-west-1"
region: "eu-west-1"
```

```yml
instance_type: "t2.large"
machine_image: "ami-for-eu-north-1"
region: "eu-north-1"
```

---

```yml
instance_type: "instance-type-1"
machine_image: "image-for-gcp-region-1"
region: "gcp-region-1"
```

```yml
instance_type: "instance-type-2"
machine_image: "image-for-gcp-region-2"
region: "gcp-region-2"
```

```yml
instance_type: "instance-type-3"
machine_image: "image-for-gcp-region-3"
region: "gcp-region-3"
```

```yml
instance_type: "instance-type-4"
machine_image: "image-for-gcp-region-4"
region: "gcp-region-4"
```

```yml
instance_type: "instance-type-5"
machine_image: "image-for-gcp-region-5"
region: "gcp-region-5"
```

## Example #3 (Preemptible/Non-Preemptible Instances)

- Single Cloud
- Multiple Instance Type
- Single Regions and Machine Image
- Preemptible and non-preemptible

```yml
runners:
- name: "aws-multiple-runner"
  cloud: "aws"
  instance_type:
    - "t2.small"
    - "t2.medium"
    - "t2.large"
  machine_image: "ami-for-eu-west-1"
  region: "eu-west-1"
  preemptible:
    - true
    - true
    - false
  labels:
    - "cirun-multiple-runner-options"
```

This would try for the following instance configuration in the given order:

```yml
  instance_type: "t2.small"
  machine_image: "ami-for-eu-west-1"
  region: "eu-west-1"
  preemptible: true
```

```yml
  instance_type: "t2.medium"
  machine_image: "ami-for-eu-west-1"
  region: "eu-west-1"
  preemptible: true
```

```yml
  instance_type: "t2.large"
  machine_image: "ami-for-eu-west-1"
  region: "eu-west-1"
  preemptible: false
```
