---
id: one-line
description: Spinup runners with one line change
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, one-line, Runners]
---

# Faster, Better, Cheaper runners with one line change

You don't need to create a `.cirun.yml` file to get access to Faster, Better and Cheaper GitHub Actions
runners on your cloud. Here are examples for one line change runners (after you have connected your cloud
provider):

Change the `runs-on` param in your `.github/workflows/<YOUR_WORKFLOW_NAME.yml>` with the following:

## Example 1: `t2.large` with `Ubuntu 2204` on AWS

```yml
  runs-on: "cirun-aws-t2-large-ubuntu2204--${{ github.run_id }}"
```

This will spinup `t2.large` with `Ubuntu 22.04` (**ami-01dd271720c1ba44f**) in `eu-west-1` on your AWS.
