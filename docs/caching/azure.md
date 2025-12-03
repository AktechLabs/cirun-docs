# Azure

The cache service stores the cache files in an blob storage container. The container will be created automatically when the first job that uses caching is run.

## Setup

Make sure you have finished installing the Cirun app on your subscription by following the instructions [here](../cloud/azure).

The following steps require the use of Azure CLI, because the Azure portal does not support creating custom roles with conditions.

1. Create a resource group with the name `cirun-cache-rg`. This can be done via the Azure portal or the Azure CLI:

```bash
az group create --name cirun-cache-rg --location eastus
```

2. Create a new custom role, which is scoped to this resource group. Make sure you replace `<SUBSCRIPTION_ID>` with your actual subscription ID. Save the following JSON to a file named `cirun-cache-rule.json`:

```json
{
  "Name": "CirunCacheStorageRBACWriter",
  "IsCustom": true,
  "Description": "Assigns Storage Blob Data Owner to managed identities on storage accounts",
  "Actions": [
    "Microsoft.Authorization/roleAssignments/read",
    "Microsoft.Authorization/roleAssignments/write",
    "Microsoft.Storage/storageAccounts/read"
  ],
  "NotActions": [],
  "AssignableScopes": [
    "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/cirun-cache-rg"
  ]
}
```

3. Create the custom role using the Azure CLI:

```bash
az role definition create --role-definition cirun-cache-rule.json
```

4. Assign the custom role to the cirun application's service principal. Replace `<APP_ID>` and `<SUBSCRIPTION_ID>` with the Application ID of the Cirun app in your Azure AD tenant and your subscription ID, respectively:

```bash
az role assignment create \
    --role "CirunStorageRBACWriter" \
    --assignee <APP_ID> \
    --scope "/subscriptions/<SUBSCRIPTION_ID>/resourceGroups/cirun-cache-rg" \
    --condition "@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {b7e6dc6d-f1e8-4753-8033-0f276bb0955b}" \
    --condition-version "2.0"
```

5. You're all set! The Cirun app will now be able to create and manage the blob storage container for caching!

:::caution

The cache container will be created automatically when the first job that uses caching is run, but due to Azure API limitations, the first job may miss the cache on its first run, especially if the caching action is called before **90 seconds**.

This happens only for the very first job that uses caching after enabling it. Subsequent jobs in the same region will work as expected.
:::
