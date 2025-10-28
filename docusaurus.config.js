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
    require.resolve("docusaurus-lunr-search"),
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
          autoCollapseCategories: true,
          hideable: true,
        },
      },
      colorMode: {
        respectPrefersColorScheme: true,
      },
      navbar: {
        // title: customFields.meta.title,
        logo: {
          alt: "Cirun Documentation",
          src: "img/cirun-logo.png",
        },
        style: "dark",
        hideOnScroll: false,
        items: [
          // right navbar items
          // {
          //   label: "Blog",
          //   position: "right",
          //   to: "/Blog",
          // },

          {
            href: customFields.githubUrl,
            position: "right",
            className: "header-github-link",
            "aria-label": "Cirun GitHub repository",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [
          {
            title: "Docs",
            items: [
              {
                label: "Quickstart",
                to: "/",
              },
            ],
          },
          {
            title: "Community",
            items: [
              {
                label: "Twitter",
                href: "https://twitter.com/CirunHQ",
              },
              {
                label: "Slack",
                href: "https://slack.cirun.io",
              },
            ],
          },
          {
            title: "More",
            items: [
              // {
              //   label: "Blog",
              //   to: "/Blog",
              // },
              {
                label: "Home",
                href: "https://cirun.io",
              },
              {
                label: "GitHub",
                href: "https://github.com/aktechlabs/cirun-docs",
              },
            ],
          },
        ],
        copyright: `Copyright © 2021-${new Date().getFullYear()} Cirun.io`,
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
