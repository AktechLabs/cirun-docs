---
id: idle-runners
description: Keep some runners idle to avoid latency
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, idle-runners, Runners]
---

# Idle Runners

Cirun creates runners on-demand on various cloud providers, which takes sometimes a
couple of minutes or more. This might not be suitable for use cases where you need
to run CI jobs almost instantly like GitHub hosted runners. This is why we introduced
the ability to keep "x" number of runners always (or at some specified times) running.
This will help you run workflows almost instantly.

:::info
Idle runners does not mean that the same machine will be re-used for jobs.
Runners are destroyed after the job completes. Idle runner configuration
makes sure that given number of runners are always available, as in a runner
is created if one of the runners picks up a job.
:::

## Examples

### Make 4 runners always available from 9 AM - 5 PM on Monday to Friday and 1 on weekend:

```yaml
runners:
  - name: aws-cpu-runner
    cloud: aws
    instance_type: t2.medium
    machine_image: ami-06fd8a495a537da8b
    preemptible: true
    labels:
      - cirun-runner
    idle:
      schedule:
        - day: mon-fri
          time: 5-7
          timezone: UTC
          replicas: 4
        - day: sat-sun
          time: 8-17
          timezone: UTC
          replicas: 1
```


### Make 4 runners always available from 9 AM - 5 PM on Monday to Friday and none on weekend:

```yaml
runners:
  - name: aws-cpu-runner
    cloud: aws
    instance_type: t2.medium
    machine_image: ami-06fd8a495a537da8b
    preemptible: true
    labels:
      - cirun-runner
    idle:
      schedule:
        - day: mon-fri
          time: 5-7
          timezone: UTC
          replicas: 4
```

### Make variable number of runners available on different days of week:

```yaml
runners:
  - name: aws-cpu-runner
    cloud: aws
    instance_type: t2.medium
    machine_image: ami-06fd8a495a537da8b
    preemptible: true
    labels:
      - cirun-runner
    idle:
      schedule:
        - day: mon
          time: 5-7
          timezone: UTC
          replicas: 2
        - day: wed
          time: 5-7
          timezone: UTC
          replicas: 3
        - day: fri
          time: 5-7
          timezone: UTC
          replicas: 4
```
