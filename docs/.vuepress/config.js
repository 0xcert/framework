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
    '@vuepress/last-updated': {},
    'register-components': {
      components: [{
        name: 'Subscription',
        path: './components/Subscription.vue'
      }]
    }
  },
  themeConfig: {
    logo: '/0xcert-logo.svg',
    displayAllHeaders: false,
    lastUpdated: 'Last Updated', // string | boolean
    repo: '0xcert/framework',
    repoLabel: 'GitHub',
    docsRepo: '0xcert/framework',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page.',
    nav: [
      { text: 'Guide', link: '/guide/introduction' },
      { text: 'v1.0', link: 'https://v1.docs.0xcert.org' },
      { text: '0xcert Home', link: 'https://0xcert.org' },
    ],
    sidebar: [
      {
        title: 'Guide',
        collapsable: false,
        children: [          
          '/guide/introduction',
          '/guide/getting-started',          
          '/guide/communication',
          '/guide/using-providers',
          '/guide/about-assets',
          '/guide/asset-management',
          '/guide/about-cryptocurrency',
          '/guide/value-management',
          '/guide/atomic-orders',
        ],
      },
      {
        title: 'Certification',
        collapsable: false,
        children: [
          ['/certification/guide', 'Guide'],
          ['/certification/api', 'API']
        ],
      },
      {
        title: 'Connectors',
        collapsable: false,
        children: [
          '/connectors/providers-guide',
          ['/connectors/ethereum-api', 'Ethereum'],
          ['/connectors/wanchain-api', 'Wanchain'],
          '/connectors/asset-management-guide',
          '/connectors/value-management-guide',
          '/connectors/atomic-deployments-guide',
          '/connectors/atomic-orders-guide',
        ],
      },
      {
        title: 'Plugins',
        collapsable: false,
        children: [
          ['/plugins/vuejs', 'VueJS'],
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
