// Note: type annotations allow type checking and IDEs autocompletion
// @ts-check

// https://github.com/FormidableLabs/prism-react-renderer
const { themes: prismThemes } = require("prism-react-renderer");
const lightCodeTheme = prismThemes.nightOwlLight;
const darkCodeTheme = prismThemes.nightOwl;

// Adding reusable information
const githubOrgUrl = "https://github.com/AktechLabs";
const domain = "https://docs.cirun.io";

// -----------------------------------------------------------------------------
// custom Fields for the project
const customFields = {
  copyright: `Copyright © 2021-${new Date().getFullYear()} Cirun.io`,
  // indexBaseUrl: true,
  meta: {
    title: "Cirun.io",
    tagline: "Cirun Documentation",
    description: "Cirun Documentation: GitHub Actions on Your Cloud",
    keywords: [
      "Cirun",
      "Github Actions",
      "Cirun cloud",
      "Cloud Authentication",
    ],
    url: "https://cirun.io/cirun-summary-image-v4.png",
  },
  domain,
  githubOrgUrl,
  githubUrl: `${githubOrgUrl}/cirun-docs`,
};

// -----------------------------------------------------------------------------
// Main site config
/** @type {import('@docusaurus/types').Config} */
const config = {
  title: customFields.meta.title,
  tagline: customFields.meta.tagline,
  url: customFields.domain,
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn",
    },
  },
  staticDirectories: ["static"],

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  // Plugings need installing first then add here
  plugins: [
    "docusaurus-plugin-sass",
    [
      require.resolve("@easyops-cn/docusaurus-search-local"),
      {
        hashed: true,
        indexDocs: true,
        indexBlog: false,
        docsRouteBasePath: "/",
        highlightSearchTermsOnTargetPage: true,
        explicitSearchResultPath: true,
      },
    ],
    [
      "posthog-docusaurus",
      {
        apiKey: "phc_x2uy37fA6ConsPdNndl4JF0CoqyIpu1999jQsOfRaT9",
        appUrl: "https://eu.i.posthog.com",
        enableInDevelopment: false,
      },
    ],
  ],
  customFields: { ...customFields },

  // ---------------------------------------------------------------------------
  // Edit presets
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          routeBasePath: "/",
          path: "docs",
          admonitions: {
            keywords: ["note", "tip", "info", "caution", "danger"],
          },
          sidebarPath: require.resolve("./sidebars.js"),
          sidebarCollapsible: true,
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/scss/application.scss"),
        },
      }),
    ],
  ],

  // ---------------------------------------------------------------------------
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: "https://cirun.io/cirun-summary-image-v4.png",
      metadata: [
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: "Cirun.io" },
      ],
      docs: {
        sidebar: {
          autoCollapseCategories: false,
          hideable: false,
        },
      },
      colorMode: {
        defaultMode: "dark",
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        // title: customFields.meta.title,
        logo: {
          alt: "Cirun Documentation",
          src: "img/cirun-logo-light.svg",
          srcDark: "img/cirun-logo-dark.svg",
        },
        hideOnScroll: false,
        items: [
          { to: "/", label: "Introduction", position: "left", activeBaseRegex: "^/$" },
          { to: "/quickstart", label: "Quickstart", position: "left" },
          { to: "/reference/", label: "Reference", position: "left" },
          { to: "/cloud/", label: "Cloud", position: "left" },
          { to: "/caching/", label: "Caching", position: "left" },
          {
            href: customFields.githubUrl,
            position: "right",
            className: "header-github-link",
            "aria-label": "Cirun GitHub repository",
          },
          {
            href: "https://cirun.io/login",
            label: "Get Started",
            position: "right",
            className: "navbar-cta",
          },
        ],
      },
      footer: {
        links: [
          {
            items: [
              { label: "Home", href: "https://cirun.io" },
              { label: "Pricing", href: "https://cirun.io/pricing" },
              { label: "Quickstart", to: "/quickstart" },
              { label: "Reference", to: "/reference/" },
              { label: "About", href: "https://aktechlabs.com/about/" },
              { label: "Blog", href: "https://aktechlabs.com/blog/" },
              { label: "Status", href: "https://cirun.instatus.com/" },
              { label: "Terms", href: "https://docs.cirun.io/terms-of-service" },
              { label: "Privacy", href: "https://docs.cirun.io/privacy-policy" },
              { label: "GitHub", href: "https://github.com/AktechLabs/cirun-docs", className: "footer-icon footer-icon-github" },
              { label: "Twitter", href: "https://twitter.com/CirunHQ", className: "footer-icon footer-icon-twitter" },
              { label: "Slack", href: "https://slack.cirun.io", className: "footer-icon footer-icon-slack" },
            ],
          },
        ],
        copyright: `© 2021-${new Date().getFullYear()} Cirun.io, Aktech Labs`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['yaml', 'bash', 'json', 'javascript', 'typescript'],
      },
    }),
};

module.exports = config;
