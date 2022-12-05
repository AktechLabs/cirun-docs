---
sidebar_position: 6
id: oracle
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---
# Oracle Cloud

```yml
# Self-Hosted Github Action Runners on Oracle Cloud via Cirun.io
# Reference: https://docs.cirun.io/Reference/yml.html
runners:
  - name: "oracle-runner"
    # Cloud Provider: Oracle
    cloud: "oracle"
    instance_type: "VM.Standard.E2.1.Micro"
    # OCID of the Machine image
    machine_image: "ocid1.image.oc1.uk-london-1.aaaaaaaavy5v3inu2ho2h57vwvvsclukdh4jvhg45um2nrejyxa7s46zcwoq"
    region: "uk-london-1"
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-oracle-runner"
```