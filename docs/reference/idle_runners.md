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

:::danger
When using idle runners, do not add the suffix `--${{ github.run_id }}` in the `runs-on` parameter
of your workflow file. That suffix is intended for creating a unique, on-demand runner per job,
which defeats the purpose of idle runners. Idle runners need to match by exact label to pick up
jobs, and adding a dynamic suffix prevents that match.
:::

Specifying idle runners in the `.cirun.yml`, does not prevent spinning up of on-demand runners, but
cirun will try to re-use existing runners where possible.

## Examples

Here are some example of specifying configuration for idle runners in `.cirun.yml`

### Make `4` runners always available from 9 AM - 5 PM on Monday to Friday and `1` on the weekend:

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
          time: 9-17
          timezone: UTC
          replicas: 4
        - day: sat-sun
          time: 9-17
          timezone: UTC
          replicas: 1
```


### Make `4` runners always available from 9 AM - 5 PM on Monday to Friday and `0` on weekend:

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
          time: 9-17
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
          time: 9-17
          timezone: UTC
          replicas: 2
        - day: wed
          time: 9-17
          timezone: UTC
          replicas: 3
        - day: fri
          time: 9-17
          timezone: UTC
          replicas: 4
```

## Schedule Reference

The `schedule` key expects a list of objects, below is the reference for the same:

### `day`

Day(s) of the week, e.g.

- `mon`
- `tue`
- `wed`
- `thu`
- `fri`
- `sat`
- `sun`

It could be a single day or a range of days, e.g.

- `mon-wed`
- `mon-fri`
- `thu-fri`
- `sat-sun`

### `time`

Time range of the day in 24-hour format, e.g.

- `8-17` (8 AM - 5 PM)
- `0-8` (12 AM - 8 AM)
- `20-23` (8 PM - 11 PM)


### `timezone`

Timezone of the schedule. This the TZ identifier from the [TZ Database](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones), e.g.

- `UTC`
- `Asia/Calcutta`
- `US/Eastern`
- `US/Central`

### `replicas`

Number of runners to keep idle, expects an integer.
