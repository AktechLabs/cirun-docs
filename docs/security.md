# Security

When transitioning to self-hosted runners for public repositories, many individuals often
wonder about the level of security it provides. Traditional self-hosted runners which are
persistent in nature may not offer robust security measures. However, opting for cirun
guarantees absolute security. Cirun ensures security by executing code within ephemeral and
meticulously isolated virtual machines that are created on demand. This approach mitigates
any potential persistent compromise of the environment or unauthorized access beyond the
information initially placed during the bootstrap process.

You can read more about self-hosted runner security on GitHub docs [here](
https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners#self-hosted-runner-security).

As per GitHub docs on runners with public repositories.

*"We recommend that you only use self-hosted runners with private repositories. This is because
forks of your public repository can potentially run dangerous code on your self-hosted runner
machine by creating a pull request that executes the code in a workflow."*


:::info

*"This is not an issue with GitHub-hosted runners because each GitHub-hosted runner is always a
clean isolated virtual machine, and it is destroyed at the end of the job execution."*


**This is true for VMs created by cirun as well as they are always a clean isolated virtual machine,
which makes them as secure as GitHub hosted runners.**

:::

## Access to code

We do not store any code or secrets on our servers. The runners are ephemeral in nature and are
destroyed immediately after job completion.

## Data Storage

We only store statistical data regarding workflows, such as build times, metadata, etc
to be able to understand service usage and performance.


## Reporting a security vulnerability

You can report security vulnerability by mailing us at amit@cirun.io
