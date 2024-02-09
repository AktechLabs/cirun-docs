# Security

When transitioning to self-hosted runners for public repositories, many individuals often
wonder about the level of security it provides. Traditional self-hosted runners which are
persistent in nature may not offer robust security measures. However, opting for cirun
guarantees absolute security. Cirun ensures security by executing code within ephemeral and
meticulously isolated virtual machines that are created on demand. This approach mitigates
any potential persistent compromise of the environment or unauthorized access beyond the
information initially placed during the bootstrap process.

## Access to code

We do not store any code or secrets on our servers. The runners are ephemeral in nature and are
destroyed immediately after job completion.

## Data Storage

We only store statistical data regarding workflows, such as build times, metadata, etc
to be able to understand service usage and performance.


## Reporting a security vulnerability

You can report security vulnerability by mailing us at amit@cirun.io
