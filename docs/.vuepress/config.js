module.exports = {
  title: "0xcert Protocol",
  description: "Create, own, and validate unique assets on the blockchain. 0xcert is the first open protocol built to support the future of digital assets, powered by the non-fungible tokens.",
  head: [
    ['link', { rel: 'icon', href: '/favicon.png' }],
  ],
  base: '/0xcert/',
  themeConfig: {
    logo: '/0xcert.png',
    lastUpdated: 'Last Updated',
    repo: '0xcert/framework',
    displayAllHeaders: false,
    nav: [
      { text: 'Documentation', link: '/' },
      { text: '0xcert Website', link: 'https://0xcert.org' },
    ],
    sidebar: [
      {
        title: 'Overview',
        collapsable: false,
        children: [
          ['/overview/introduction', 'Introduction'],
          ['/overview/queries-and-mutations', 'Queries & Mutations'],
          ['/overview/atomic-orders', 'Atomic Orders'],
          ['/overview/providers', 'Providers'],
          ['/overview/cryptocurrency', 'Cryptocurrency'],
          ['/overview/assets', 'Assets'],
          ['/overview/certification', 'Certification'],
          ['/overview/support', 'Support'],
        ],
      },
      {
        title: 'Guide',
        collapsable: false,
        children: [
          ['/guide/getting-started', 'Getting started'],
          ['/guide/using-providers', 'Using Providers'],
          ['/guide/error-handling', 'Error Handling'],
          ['/guide/certification', 'Certification'],
          ['/guide/managing-assets', 'Managing Assets'],
          ['/guide/value-transfer', 'Value Transfer'],
          ['/guide/atomic-orders', 'Atomic Orders'],
        ],
      },
      {
        title: 'API',
        collapsable: false,
        children: [
          ['/api/core', 'Core'],
          ['/api/ethereum', 'Ethereum'],
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
  },
}
