# Arm based machines

Cirun also supports arm based machines.

Here is an example of an arm based machine on AWS:

```yaml
runners:
  - name: aws-cpu-arm-runner
    cloud: aws
    instance_type: a1.medium
    # AMI for ubuntu/images/hvm-ssd/ubuntu-focal-20.04-arm64-server
    machine_image: ami-0229f8cfc24033d05
    preemptible: false
    workflow: .github/workflows/aws-cpu-arm.yml
    count: 1
```
