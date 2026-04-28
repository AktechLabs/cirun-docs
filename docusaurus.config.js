// Note: type annotations allow type checking and IDEs autocompletion
// @ts-check

// https://github.com/FormidableLabs/prism-react-renderer/tree/master/src/themes
const lightCodeTheme = require("prism-react-renderer/themes/nightOwlLight");
const darkCodeTheme = require("prism-react-renderer/themes/nightOwl");

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
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
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
            tag: ":::",
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
module.exports = {
  themeConfig: {
    metadata: [
      {
        name: "twitter:image",
        content: "https://cirun.io/cirun-summary-image-v4.png",
      },
    ],
    // This would become <meta name="keywords" content="cooking, blog"> in the generated HTML
  },
};
module.exports = {
  // ...
  customFields: {
    image: "https://cirun.io/cirun-summary-image-v4.png",
    keywords: ["twitter:image"],
  },
  // ...
};
module.exports = {
  themeConfig: {
    image: "https://cirun.io/cirun-summary-image-v4.png",
  },
};

module.exports = {
  plugins: [
    [
      "posthog-docusaurus",
      {
        apiKey: "phc_x2uy37fA6ConsPdNndl4JF0CoqyIpu1999jQsOfRaT9",
        appUrl: "https://eu.i.posthog.com",
        enableInDevelopment: false, // optional
        // other options are passed to posthog-js init as is
        // NOTE: options are passed through JSON.stringify(), so functions (such as `sanitize_properties`) are not supported.
      },
    ],
  ],
};

module.exports = config;
