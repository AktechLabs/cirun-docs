# Cloud Authentication

## Google Cloud Platform

- Create a Service Account with Compute Engine Admin Permissions
- Make to enabled Compute Engine API: <https://cloud.google.com/apis/docs/getting-started#enabling_apis>
- Paste you Service Account JSON in the "Cloud" Tab of Cirun Dashboard under GCP section.

### GPU

If you need to be able to create GPU enabled runners, make sure to request
Google to increase your quota for GPUs, its 0 by default. See <https://cloud.google.com/compute/quotas#gpu_quota>


## Amazon Web Services

- Create an IAM account to EC2Admin Permissions
- Generate an "Access Key" and "Secret Key" for that IAM user
- Paste your "Access Key" and "Secret Key" in the "Cloud" Tab of Cirun Dashboard under AWS section.

## DigitalOcean

Just click on Connect DigitalOcean button in the Cloud in the Cirun Dashboard.

## Azure

- Goto azure active directory from your azure dashboard.
- Register a new application in App registrations with name "cirun" and give it "Accounts in any organizational directory (Any Azure AD directory - Multitenant)" access.
- Now copy the "Application (client) ID", "Directory (tenant) ID"
- Click on the "Certificates & secrets" and create a new client secret and copy the "Value"
- Now goto your Subscriptions, copy subscription id
- Goto Access control(IAM), click on "Add role assignment" then select "Contributor", click on Select members and search for "cirun" and select it.
- Click on "Review and assign"
- Paste your "Subscription ID", "Tenant ID", "Client ID" and "Client Secret" in the Cirun Dashboard.

# Cloud Login Page

![Cirun cloud page](../images/cloud.png)
