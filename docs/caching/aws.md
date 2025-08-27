# Amazon Web Services

The cache service stores the cache files in an S3 bucket. The bucket will be created automatically when the first job that uses caching is run.

## Permissions

In order to manage buckets and objects, the IAM user that is used by Cirun needs to have the following permissions:

```json
{
    "Sid": "S3BucketManagement",
    "Effect": "Allow",
    "Action": [
        "s3:CreateBucket",
        "s3:DeleteBucket",
        "s3:ListBucket",
        "s3:GetBucketLocation",
        "s3:GetBucketVersioning",
        "s3:PutBucketVersioning"
    ],
    "Resource": "arn:aws:s3:::cirun-caching-*"
},
{
    "Sid": "S3ObjectManagement",
    "Effect": "Allow",
    "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:DeleteObject",
        "s3:ListMultipartUploadParts",
        "s3:AbortMultipartUpload"
    ],
    "Resource": "arn:aws:s3:::cirun-caching-*/*"
},
{
    "Sid": "IAMRoleManagement",
    "Effect": "Allow",
    "Action": [
        "iam:CreateRole",
        "iam:DeleteRole",
        "iam:GetRole",
        "iam:ListRoles",
        "iam:PutRolePolicy",
        "iam:DeleteRolePolicy",
        "iam:ListRolePolicies",
        "iam:GetRolePolicy",
        "iam:UpdateAssumeRolePolicy"
    ],
    "Resource": [
        "arn:aws:iam::*:role/CirunCacheRole",
        "arn:aws:iam::*:role/CirunCache*Role"
    ]
},
{
    "Sid": "STSOperations",
    "Effect": "Allow",
    "Action": [
        "sts:GetCallerIdentity"
    ],
    "Resource": "*"
},
{
    "Sid": "STSAssumeRole",
    "Effect": "Allow",
    "Action": [
        "sts:AssumeRole"
    ],
    "Resource": "arn:aws:iam::<ACCOUNT_ID>:role/CirunCache*"
},
{
    "Sid": "AllowPolicySimulation",
    "Effect": "Allow",
    "Action": [
        "iam:SimulatePrincipalPolicy",
        "iam:GetContextKeysForPrincipalPolicy",
        "iam:GetPolicy",
        "iam:GetPolicyVersion",
        "iam:GetUserPolicy",
        "iam:GetRolePolicy"
    ],
    "Resource": "*"
}
```

## Increasing throughput of the cache service

By default, most EC2 instances have a default limit of 125 MBPS on gp3 EBS volumes. This limits the speed at which cache files can be uploaded and downloaded from the S3 bucket. This can be increased by modifying the `Throughput` parameter of the EBS volume.

To increase the throughput, you need to modify the `extra_config` section in your `.cirun.yml` file like so:

```yaml
extra_config:
  cache: true # Enable caching
  BlockDeviceMappings:
    - DeviceName: /dev/sda1
      VolumeType: gp3
      VolumeSize: 75 # Size in GB
      Throughput: 400 # Increase throughput to 400 MBPS
```

This will increase the throughput of the EBS volume to 400 MBPS, which should be sufficient for most use cases. You can increase this value further according to your needs.
