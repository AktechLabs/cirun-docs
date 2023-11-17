---
id: access-control
description: Access Control
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Examples, Cloud Platform, Runners]
---

# Access Control

When using cirun.io in an organization, quite often you need the ability to control
access to runners per repository to control usage, cost and availability. Cirun provides
a way to access control runners via the following mechanism:

You'd create a repository named `.cirun` in your organization and create a couple of config files
to control access.

## Relevant Files

### 1. `.cirun.global.yml`

This is the file where you'd define all the runner configurations you'd
want to use in the organization. The format of this file is same as `.cirun.yml`, for example:


```yaml
runners:
  - name: gpu-runner
    cloud: openstack
    instance_type: gpu_large
    machine_image: ubuntu-2204-nvidia-docker-20221229
    region: RegionOne
    labels:
      - cirun-openstack-gpu
      - openstack-gpu-runner

  - name: cpu-runner
    cloud: openstack
    instance_type: ci_medium
    machine_image: ubuntu-2204-cloud-jammy-20221104
    region: RegionOne
    labels:
      - cirun-cpu-runner
      - openstack-cpu-runner

  - name: aws-runner
    cloud: aws
    instance_type: t2.medium
    machine_image: ami-06fd8a495a537da8b
    preemptible: true
    labels:
      - cirun-runner
```

### 2. `.access.yml`

This is the file, where you'd define the rules for access control. Let's take an example to understand how it works:

```yaml
version: 1

policies:
  - id: cirun-sandbox-policy
    repo: cirun-sandbox
    teams:
      - core
      - alpha
      - beta
  - id: cirun-demo-repo-policy
    repo: cirun-demo
    teams:
      - core
      - demo

access_control:
  - resource: gpu-runner
    policies:
      - cirun-demo-repo-policy
  - resource: cpu-runner
    policies:
      - cirun-sandbox-policy
      - cirun-demo-repo-policy
  - resource: aws-runner
    policies:
      - cirun-demo-repo-policy
      - cirun-sandbox-policy
```

Let's try to understand this configuration:

- `policies`: A policy is a set of a repository and teams.
- `access_control`: Access control defines which policies have access to resource.

To simplify which combination of repository and teams have access to a resource. In other words,
if there is an event of a workflow job and that requires cirun to spinup a resource (runner),
it will only spinup a runner if that workflow job was triggered by a member of the given team
on a given repository in a policy defined on that resource.

## Configuration Reference

### `policies`

A policy defines the access control rules for a particular repository.

- `id`: (string) A unique identifier
- `repo`: (string) name of the github repository, for which the rule is defined.
- `teams`: (list of string) list of teams who can spinup runners for the given repository, i.e. all the members of the given team can spinup runners (the resources which have this policy attached) for the given repository.
- `roles`: (list of string) list of roles the user must have on the repository to be able to spinup runners on the repository.
- `users`: (list of string) list of users (github usernames) who can spinup runners in the repository.
- `pull_request`: (boolean): If the users in the above-mentioned teams/users can spinup runners on a pull request. Default is false.

### `access_control`

An access control entry defines what policies are attached to a resource. The users in a policy can spinup given
resource on the repository in that policy.

- `resource`: (string) Name of the cirun resource i.e. the name of the runner configuration from `.cirun.global.yml`.
This is the runner configuration a user authorizes in the policy can spin up.
- `policies`: (list of string) List of policies that will have access to a given resource.

### From the above example:
If a workflow job is triggered on `aktechlabs/cirun-demo` and it requests the resource `gpu-runner`,
then it must have been triggered by a member of `demo` or `core` teams to be authorized get a `gpu-runner`.

## API Client

There is an API client to manage the `.access.yml` file programmatically as well.
[https://github.com/AktechLabs/cirun-py](https://github.com/AktechLabs/cirun-py)
