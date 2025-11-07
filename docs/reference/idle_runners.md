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

## How Idle Runners Work

The idle runner count represents the number of runners that are **always kept idle and ready** to pick up jobs immediately.

For example, if you configure `replicas: 4`:
- Cirun maintains **4 runners that are idle** at all times
- When one of these idle runners picks up a job, it is **no longer considered idle**
- A new runner is **automatically spun up** to replace it and maintain the count of 4 idle runners
- This means you could have 4 idle runners + any number of busy runners running jobs simultaneously

**Important:** Runners are **not reused** between jobs - each runner is destroyed after completing a job. The idle count is maintained continuously - as soon as an idle runner becomes busy, a replacement is created. This ensures you always have N fresh runners ready to start jobs instantly.

### Capacity Planning

Since Cirun maintains N runners that are always idle (not N total runners), calculating your needs depends on:
- **Job duration**: How long your typical jobs take to complete
- **Startup time**: How long it takes to provision a new runner on your cloud provider
- **Concurrency**: How many jobs you typically run simultaneously

If jobs complete faster than new runners can be provisioned, you may need more idle runners to handle concurrent workloads effectively.

:::danger
When using idle runners, do not add the suffix `--${{ github.run_id }}` in the `runs-on` parameter
of your workflow file. That suffix is intended for creating a unique, on-demand runner per job,
which defeats the purpose of idle runners. Idle runners need to match by exact label to pick up
jobs, and adding a dynamic suffix prevents that match.
:::

:::caution
Idle runner configuration is read from the `.cirun.yml` file on your repository's **default branch only**.
If you add or update idle runner configuration in a feature branch, it will not take effect until the changes
are merged to the default branch (usually `main` or `master`).

**Why default branch only?**

Idle runners are created periodically, independent of any specific workflow run or pull request. Since there's
no branch context when creating idle runners, Cirun reads the configuration from the default branch to ensure
consistent and stable idle runner behavior.
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

## Usage-based Idle Runners

In addition to schedule-based idle runners, Cirun also supports usage-based idle runners. These runners are automatically created and maintained based on actual usage patterns, making them ideal for iterative development workflows where you need fresh runners available immediately after the first job completes.

### How It Works

Usage-based idle runners are triggered when a runner gets allocated to a job. Once triggered, Cirun maintains the specified number of idle runners for the configured duration, then automatically scales them down when the development session ends.

### Key Features

- **Fresh runners**: Each job gets a clean, fresh runner (not reused)
- **Automatic scaling**: Runners are created only when needed and scaled down automatically
- **Perfect for development**: Ideal for iterative workflows where you push multiple commits in succession
- **Cost-effective**: Only runs idle runners during active development periods

### Example Configuration

```yaml
runners:
  - name: aws-cpu-runner
    cloud: aws
    instance_type: t3.medium
    machine_image: ami-06fd8a495a537da8b
    preemptible: true
    labels:
      - cirun-runner
    idle:
      usage_based:
        trigger: runner_allocated
        replicas: 2
        duration: 180  # 3 hours in minutes
```

:::danger
Do not mix schedule-based and usage-based idle runners in the same runner configuration. Choose either `schedule` OR `usage_based`, but not both. If you need both types of idle runners, create separate runner configurations with different names.
:::

## Usage-based Configuration Reference

### `trigger`

Currently supports only `runner_allocated`, which triggers the creation of idle runners when any runner matching the configuration gets allocated to a job.

### `replicas`

Number of idle runners to maintain during the active period. Expects a positive integer.

### `duration`

Duration in minutes to keep idle runners active after the trigger event. After this period, idle runners will be automatically scaled down. Expects a positive integer.

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

## Organization level configuration

Idle runner configurations can be applied at the organization level, allowing you to maintain a pool of available
runners for all repositories within your organization. This centralized approach simplifies management and ensures
consistent CI/CD performance across your entire organization.

### Setting Up Organization-wide Idle Runners

To configure organization-level idle runners:

1. Create a new repository named `.cirun` within your organization
2. Install the Cirun application for this repository through the Cirun dashboard
3. Create a file named `.cirun.global.yml` in the root of the `.cirun` repository
4. Add your idle runner configuration using the same format shown in the examples above

Now all the repositories within your organization will have access to the specified idle runners based on the labels
provided in the `runs-on` configuration of your workflows.

Note: You must install the cirun application on all repositories that you want to use the idle runners on.

:::danger
If you don't install the cirun application on a repository that you're using with idle runners, then cirun
will not have access to the repository's webhook events and cirun will not be able to terminated used
runners, which would also block the creation of new runners as the `replicas` count will not decrease.
:::
