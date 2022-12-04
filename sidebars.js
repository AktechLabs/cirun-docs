/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */

module.exports = {
  sidebar: [
    {
      label: "Quickstart",
      type: "doc",
      id: "Quickstart",
    },
    {
      type: "category",
      label: "Reference",
      // link: {
      //   type: "generated-index",
      //   title: "Reference",
      //   slug: "category/Reference",

      //   keywords: ["Reference"],
      // },
      link: { type: "doc", id: "reference/index" },
      items: [
        "reference/yaml",
        "reference/fallback-runners",
        "reference/unique-runner-labels",
        "reference/developer-api",
        // "reference/gotchas",
      ],
    },
    {
      type: "category",
      label: "Cirun.yml Examples",
      link: { type: "doc", id: "examples/index" },
      items: [
        "examples/aws",
        "examples/azure",
        "examples/do",
        "examples/gcp",
        "examples/openstack",
        "examples/oracle",
      ],
    },
    {
      type: "category",
      label: "Cloud",
      link: { type: "doc", id: "cloud/index" },
      items: [
        "cloud/aws",
        "cloud/azure",
        "cloud/do",
        "cloud/gcp",
        "cloud/openstack",
        "cloud/oracle",
      ],
    },
    {
      type: "category",
      label: "Custom Images",
      link: { type: "doc", id: "custom-images/index" },
      items: [
        "custom-images/cloud-custom-images",
        "custom-images/arm-based-machines",
      ],
    },
    {
      type: "doc",
      label: "Privacy",
      id: "privacy-policy",
    },
    {
      type: "doc",
      label: "Terms of Service",
      id: "terms-of-service",
    },
  ],
};
