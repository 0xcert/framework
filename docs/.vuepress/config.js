module.exports = {
  title: '0xcert Framework v2.0 - beta',
  description: 'Leverage the most advanced open-source framework to create, manage and swap digital assets (ERC-721) and value tokens (ERC-20) on the blockchain.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  plugins: {
    '@vuepress/pwa': {
      serviceWorker: true,
      updatePopup: true
    },
    '@vuepress/google-analytics': {
      'ga': 'UA-114983924-2'
    },
    '@vuepress/last-updated': {}
  },
  themeConfig: {
    logo: '/0xcert-logo.svg',
    displayAllHeaders: false,
    lastUpdated: 'Last Updated',
    repo: '0xcert/framework',
    repoLabel: 'GitHub',
    docsRepo: '0xcert/framework',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page.',
    nav: [
      { text: 'v1.0', link: 'https://v1.docs.0xcert.org' },
      { text: '0xcert Home', link: 'https://0xcert.org' },
    ],
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        children: [
          '/introduction/overview',
          '/introduction/getting-started',          
          '/introduction/non-fungible-assets',
          '/introduction/fungible-values',
          '/introduction/0xcert-tokens.md',
          '/introduction/atomic-transactions',
          '/introduction/interoperability',
          '/introduction/authenticity',
          '/introduction/threat-models',
        ],
      },
      {
        title: 'Guides',
        collapsable: false,
        children: [
          '/guides/certification',
          '/guides/communication',
          '/guides/providers',
          '/guides/asset-management',
          '/guides/value-management',
          '/guides/atomic-deployments',
          '/guides/atomic-actions',
        ],
      },
      {
        title: 'API References',
        collapsable: false,
        children: [
          '/api/certification',
          ['/api/0xcertapi-rest', '0xcertAPI REST'],
          ['/api/0xcertapi-client', '0xcertAPI Client'],
          '/api/ethereum-connectors',
          '/api/wanchain-connectors',
          ['/api/vuejs-plugin', 'Vue.js Plugin'],
        ],
      },
    ],
  },
  markdown: {
    lineNumbers: false,
    extendMarkdown: md => {
      md.use(require('markdown-it-container'), 'card', {
        validate: function (params) {
          return params.trim().match(/^card\s+(.*)$/);
        },
        render: function (tokens, idx) {
          let title = tokens[idx].info.trim().match(/^card\s+(.*)$/);
          return tokens[idx].nesting === 1 ? 
            '<div class="card custom-block"><p class="custom-block-title">' + md.utils.escapeHtml(title[1]) + "</p>\n"
            : '</div>\n';
        },
      });
    },
    externalLinks: {
      target: '_self',
      rel: 'noopener noreferrer alternate',
    },
  },
};
