---
sidebar_position: 5
id: openstack
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---
# Openstack

```yml
# Self-Hosted Github Action Runners on Openstack via Cirun.io
# Reference: https://docs.cirun.io/Reference/yml.html
runners:
  - name: "openstack-runner"
    # Cloud Provider: Openstack
    cloud: "openstack"
    # Instance type refers to flavors in openstack
    instance_type: "m1.small"
    # By default openstack provides cirros image
    # To build custom image check the custom image docs
    # This image is not suitable for jobs to be performed by runner, refer to custom image docs and create a new image first
    machine_image: "cirros-0.5.2-x86_64-disk"
    # preemptible instances not supported
    # Add this label in the "runs-on" param in .github/workflows/<workflow-name>.yml
    # So that this runner is created for running the workflow
    labels:
      - "cirun-openstack-runner"
```