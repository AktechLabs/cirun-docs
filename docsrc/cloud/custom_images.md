# Custom Images for Runner

You can use custom images for your runners as well. One use case for that
is you want pre installed packages.


## AWS Custom AMI

One of the most common applications of Cirun is the ability to run CI on
a GPU enabled machine and for running GPU tests it's good to have nvidia
drivers pre-installed.

AWS Marketplace has many such useful images, which can  help make your
CI faster.

### NVIDIA Deep Learning AMI

Let's take an example of using an NVIDIA Deep Learning AMI for GPU enabled
runners.

To use any AMI (Amazon Machine Image) in your `.cirun.yml`, you need two things:

```{admonition} Note
1. The AMI ID for the runner in that region (default region is `eu-west-1`).
2. Accept Terms and condition for the AMI.
```

Here are the steps to achieve the above.

1. Go to [AWS Marketplace](https://aws.amazon.com/marketplace) and Search for "**NVIDIA Deep Learning AMI**".
2. In the search results click on the "**NVIDIA Deep Learning AMI**".

   ![Cirun cloud page](../images/nvidia-aws-ami.png)

3. Click on "**Continue to Subscribe**" on the top right to accept terms and condition. (You need to be
   logged in to your AWS account for this). You should see the following page
   after subscribing.
   ![Cirun cloud page](../images/nvidia-aws-ami-subscribed.png)

4. Click on "**Continue to configuration**" button on the top right.
   ![Cirun cloud page](../images/nvidia-aws-ami-config.png)

5. Here you can see the Ami Id of the image, which now you can use in your `.cirun.yml` as following:
   ```yaml
       machine_image: ami-00ac0c28c01352e53
       region: eu-west-1  # this is default region anyways (only required if using an AMI ID from different region)
   ```
   ![Cirun cloud page](../images/nvidia-aws-ami-id.png)

In the above photo we can see the AMI ID for "**NVIDIA Deep Learning AMI**" in the Ireland region (`eu-west-1`).

```{note}
Pricing: This AMI is free to use, the pricing you see on the right is the price for the instance
not for the AMI.
```

### AWS Marketplace NVIDIA Deep Learning AMI `.cirun.yml`

```{admonition} Note
:class: error
It is important to accept terms and conditions of the AMI you want to use, using
the process described above, otherwise you'll not be able to provision the
runner.
```

```yaml
# Self-Hosted Github Action Runners on AWS via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: gpu-runner
    # Cloud Provider: AWS
    cloud: aws
    instance_type: g4dn.xlarge
    # NVIDIA Deep Learning AMI from AWS Marketplace
    # https://aws.amazon.com/marketplace/pp/prodview-e7zxdqduz4cbs
    machine_image: ami-00ac0c28c01352e53
    # preemptible instances seems quite less reliable.
    preemptible: false
    # Path of the relevant workflow file
    workflow: .github/workflows/test.yml
    # Number of runners to provision on every trigger on Actions job
    # See .github/workflows/build-gpu.yml
    count: 1
```

## AZURE Custom Images

For making custom images in azure user needs to just capture an existing vm and create image in a resource group.

### Nginx Ubuntu custom image

Let's take an example of how to create a custom image on azure. We will make a ubuntu image with nginx pre-installed. Then we will create a vm using this custom image. Here are the steps to achieve the above.

1. Create a ubuntu vm in a new or existing resource group from azure dashboard.
2. SSH into the vm and install nginx using.
   ```
   sudo apt install nginx
   ```
3. Now capture the vm using capture button inside the vm. "For Share image to Shared image gallery" option select "No, capture only a managed image". 
4. Also tick the checkbox having option "Automatically delete this virtual machine after creating the image".
5. Change the name of vm and click on review and create.
6. After the image has been created go to the resource group in which you have created the image. Your image will be present here.
7. To list all custom images using azure cli use
   ```
   az image list
   ```
8. The above commad shows all the custom images available on your auzre. It also shows "id" for all custom images. This is the parameter we use to make vm with custom image.

### AZURE custom image vm `.cirun.yml`

The .cirun.yml for above custom image will look like

```yaml
# Self-Hosted Github Action Runners on AZURE via Cirun.io
# Reference: https://docs.cirun.io/reference/yaml.html
runners:
  - name: azure-runner
    # Cloud Provider: AZURE
    cloud: azure
    instance_type: Standard_DS1_v2
    machine_image:
      # myResourceGroup is the name of resource group in which image is present, myCustomImage is the name of image
      # use az image list in azure cli to know your image id 
      id: /subscriptions/d74a1d71-99ffab4a5/resourceGroups/myResourceGroup/providers/Microsoft.Compute/images/myCustomImage
    # preemptible instances seems quite less reliable.
    preemptible: false
    # Path of the relevant workflow file
    workflow: .github/workflows/test.yml
    # Number of runners to provision on every trigger on Actions job
    count: 1
```