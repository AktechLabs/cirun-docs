# Caching

Cirun supports caching of dependencies and build outputs to speed up subsequent runs of workflows. It is compatible with `actions/cache`, `docker/build-push-action`, `actions/setup-*` and other actions that support github actions caching.

:::caution
This feature is currently only supported on linux runners on AWS.
:::

## How it works

When caching is enabled, Cirun will create a dedicated storage bucket (S3 for AWS, Blob Storage for Azure, Object Storage for GCP) to store cache files. The bucket will be named `cirun-caching-<region>-<user_id>`, where `<region>` is the region where your runner is deployed.

When a job runs, this bucket will be used to store and retrieve any cache files.

## Configuration

### 1. Enable caching in the runner configuration.

To enable caching, you need to modify the `extra_config` section in your `.cirun.yml` file like so:

```yaml
runners:
  - name: aws-runner
    cloud: aws
    region: eu-west-1
    instance_type: t3.large
    machine_image: ami-0910be1e1d214d762
    labels:
      - "cirun-aws-runner"
    extra_config:
      cache: true # Enable caching
```

This will enable caching for all jobs that are run on this runner. Any requests to github actions cache will be redirected towards cloud storage (S3 for AWS, Blob Storage for Azure, Object Storage for GCP).

:::info
If you are having issues with throughput, you should increase the volume throughput. See:

- [Guide for AWS runners](/caching/aws#increasing-throughput-of-the-cache-service)
::: 

### 2. Update IAM permissions

Update IAM permission for the cirun user to include the correct permission:

- [AWS Permissions](/caching/aws#permissions)

### 3. Update your workflow to use caching

- For `@actions/cache`, `@actions/setup-*` and other actions which utilise github actions cache (`actions/toolkit/cache`), you don't need to make any changes to your workflow. Cirun will automatically redirect cache requests to the cloud storage.
- For `@docker/build-push-action`, you need to add `network=host` to buildx configuration and set the `cache-from` and `cache-to` options in `build-push-action` like so:

```yaml
- name: Set up Docker Buildx
  uses: docker/setup-buildx-action@v3
  with:
    driver-opts: network=host # Add this line

- name: Build and push Docker image
  uses: docker/build-push-action@v3
  with:
    context: .
    push: true
    tags: user/app:latest
    cache-from: type=gha,url_v2=http://127.0.0.1:6420/ # Add this line
    cache-to: type=gha,mode=max,url_v2=http://127.0.0.1:6420/ # Add this line
```

:::caution
Make sure to use `url_v2` instead of `url`. The `url` option is not supported by Cirun.
:::

:::caution
If docker is not configured to use url_v2, the cache will be uploaded to github's cache service instead of the cloud storage, which can result to slow uploads and downloads.
:::
