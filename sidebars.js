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
        "reference/one-line",
        "reference/fallback-runners",
        "reference/unique-runner-labels",
        "reference/examples",
        "reference/developer-api",
        "reference/organization-runner-configuration",
        "reference/access-control",
        "reference/idle-runners",
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
      type: "category",
      label: "OS Platform",
      link: { type: "doc", id: "os-platform/index" },
      items: [
        "os-platform/windows",
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
    {
      type: "doc",
      label: "Security",
      id: "security",
    },
  ],
};
