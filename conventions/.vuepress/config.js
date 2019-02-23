module.exports = {
  title: '0xcert Conventions',
  description: 'Create, own, and validate unique assets on the blockchain. 0xcert is the first open protocol built to support the future of digital assets, powered by the non-fungible tokens.',
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  plugins: [
    '@vuepress/pwa', {
      serviceWorker: true,
      updatePopup: true
    },
    '@vuepress/google-analytics', {
      ga: 'UA-114983924-2'
    },
    '@vuepress/last-updated'
  ],
  
  themeConfig: {
    logo: '/0xcert-logo.svg',
    displayAllHeaders: false,
    lastUpdated: 'Last Updated', // string | boolean
    repo: '0xcert/framework',
    repoLabel: 'GitHub',
    docsRepo: '0xcert/framework',
    docsDir: 'conventions',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'Help us improve this page.',
    serviceWorker: {
      updatePopup: true,
    },
    nav: [
      { text: '0xcert Docs', link: 'https://docs.0xcert.org' },
      { text: '0xcert Home', link: 'https://0xcert.org' },
    ],
    sidebar: [
      {
        title: 'Conventions',
        collapsable: false,
        children: [
          ['/86-base-asset-schema', 'Base asset schema'],
          ['/87-asset-evidence-schema', 'Asset evidence schema'],
          ['/88-crypto-collectible-schema', 'Crypto collectible schema'],
        ],
      },
    ],
  },
  markdown: {
    lineNumbers: false,
    externalLinks: {
      target: '_self',
      rel: 'noopener noreferrer alternate',
    },
  },
};
