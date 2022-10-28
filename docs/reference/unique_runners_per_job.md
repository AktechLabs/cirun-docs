---
id: unique-runner-labels
description: Runners with unique labels for every job
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, labels, unique-labels]
---

# Unique runner labels per job

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Documentation" />
  <meta name="twitter:description" content="No Runner matching labels." />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

It might often happen that the runner created for a workflow gets picked by another
workflow with same set of labels. To tackle this situation, we recommend adding `github.run_id`
suffix to `runs-on` param in your GitHub Worklow.


```yaml
# In your github workflow file
runs-on: "cirun-runner--${{ github.run_id }}"
```

* No change in your `.cirun.yml` required:

```yaml
# Your .cirun.yml
runners:
  - name: cirun-aws
    cloud: aws
    instance_type: t3.2xlarge
    machine_image: ami-053936483e05f526a
    labels:
      - cirun-runner
```

:::note
Note: You can add any suffix to your label separated by `--`. Anything after this
will be ignored for matching labels in your `.cirun.yml` file, but the runner will
be created with suffix to help uniquely match runner with the workflow job.
:::

## Unique runners for matrix jobs

Using the methodology mentioned above you can have unique runners for each job in the matrix:

```yaml
jobs:
  example_matrix:
    strategy:
      matrix:
        os:
          - "cirun-runner--10-${{ github.run_id }}"
          - "cirun-runner--12-${{ github.run_id }}"
          - "cirun-runner--14-${{ github.run_id }}"
        version: [10, 12, 14]
    runs-on: ${{ matrix.os }}
    steps:
      - uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.version }}
```

* Similarly, no change in your `.cirun.yml` required in this case either:

```yaml
# Your .cirun.yml
runners:
  - name: cirun-aws
    cloud: aws
    instance_type: t3.2xlarge
    machine_image: ami-053936483e05f526a
    labels:
      - cirun-runner
```
