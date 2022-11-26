---
sidebar_position: 6
id: oracle
description: Cirun Documentation - Cloud Authentication.
image: "https://cirun.io/cirun-summary-image-v4.png"
keywords: [Cirun, Gcp, digitalocean, azure, Amazon web services, open stack, Authentication, Oracle]
---

# Oracle Cloud

If you're using Oracle as a cloud provider for Cirun, this is how you would give
Cirun access to your Oracle, for it to be able to create runners.


The documentation for creating the credentials for Oracle Cloud
can be found [here](https://docs.oracle.com/en-us/iaas/Content/API/Concepts/apisigningkey.htm).

The values for credentials that you need to add in the Cloud section of
Cirun Dashboard would look something like this:

### Config Auth

```bash
[DEFAULT]
user=ocid1.user.oc1..aaaaaaaaj2poftoscirunfororaclecmpcbrmvvescirunfororacle4mtq
fingerprint=78:4c:99:1t:3d:1b:a8:ea:f2:dd:cr:01:5r:86:a2:84
tenancy=ocid1.tenancy.oc1..aaaaaaaaydlj6wd4ldaamhmhcirunfororaclemocirunfororacle
compartment_id=ocid1.tenancy.oc1..aaaaaaaaycirunfororaclemhmhfhcirunfororacleljaij5xvuen7a
```

### Private Key

```bash
-----BEGIN PRIVATE KEY-----
JDApSaTTzXGtOr+Xwh8Ng7BBNJr/6tILwxK+C/rCFpVoJGPEIsoi1BynfwbOR8nR
qVFX3uYDPYA3/JmrHFaR4HXawDiPfzR04+7iUWvj/mQxMSzpn5BEE6qF6GnQ9+Bg
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
aF13OCzk6DitCDZkqscCkWFfVHLoetbb/dcJigz8sf2EiI3EE9mXgchjnT+xz0iQ
aF13OCzk6DitCDZkqscCkWFfVHLoetbb/dcJigz8sf2EiI3EE9mXgchjnT+xz0iQ
aF13OCzk6DitCDZkqscCkWFfVHLoetbb/dcJigz8sf2EiI3EE9mXgchjnT+xz0iQ
aF13OCzk6DitxxCirunRocksItReallyDoesXXetbb/dcJigz8sf2EiI3EE9mXgc
aF13OCzk6DitCDZkqscCkWFfVHLoetbb/dcJigz8sf2EiI3EE9mXgchjnT+xz0iQ
aF13OCzk6DitCDZkqscCkWFfVHLoetbb/dcJigz8sf2EiI3EE9mXgchjnT+xz0iQ
aF13OCzk6DitCDZkqscCkWFfVHLoetbb/dcJigz8sf2EiI3EE9mXgchjnT+xz0iQ
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
6vdVbYSuv/SdVCt7huYCy7n1Yj040DBxUYp8aokCgYEAi3480JrgBfRMkNYFkD6s
-----END PRIVATE KEY-----
```

# Cloud Login Page

![Cirun cloud page](../../static/cloud/cloud.png)
