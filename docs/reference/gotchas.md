---
description: Gotchas
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Github Actions, Gotchas, labels, No runners]
---

# Gotchas

<head>
  <body className="other-extra-body-class" />
  <title>Cirun Docs</title>
  <meta data-rh="true" name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="https://docs.cirun.io" />
  <meta name="twitter:title" content="Cirun Documentation" />
  <meta name="twitter:description" content="Gotchas" />
  <meta name="twitter:image" content="https://docs.cirun.io/img/cirun-summary-image-v4.png" />
</head>

## No Runner matching labels

:::danger
No runner matching the specified labels was found: self-hosted
:::

This is the most common gotcha a new user faces.

The most common reason for this is, either of the following:

- There are no runners configured for the repository or yet not configured.

![No runners](../../static/Gotchas/no-runners.png)

- None of the configured runners matches the label from the workflow. Consider the
  following case, here the attached runner has labels: (`self-hosted, linux, x64, cirun.io, cpu, gcp, cirun-runner,`) and lets say the workflow you are trying to run
  requires a runner with label `self-hosted` and `gpu` and now clearly the runner
  below does not have `gpu` label, hence the workflow will fail immediately.

![No runners matching labels](../../static/Gotchas/no-matching-labels.png)

GitHub workflows fail immediately if there is no action runner available for your builds.
The first time you setup Cirun (first push to trigger cirun runner creation) there won't
be a runner attached to your repository.

:::note Solution
The solution to this is to try again (push again) after few minutes.
:::

Cirun creates the runner the first time you push to your repository with
the labels mentioned in the `.cirun.yml`, so that the next time the workflow
is triggered, GitHub is able to queue the workflow run, so that Cirun can
spin up a runner on the cloud for the GitHub Actions to run jobs on it.
This process takes a few minutes.
