module.exports = {
  title: "0xcert Protocol",
  description: "Create, own, and validate unique assets on the blockchain. 0xcert is the first open protocol built to support the future of digital assets, powered by the non-fungible tokens.",
  head: [
    ['link', {
      rel: 'icon',
      href: '/logo.png'
    }]
  ],
  themeConfig: {
    repo: '0xcert/framework',
    sidebar: [
      {
        title: 'Introduction',
        collapsable: false,
        children: [
          ['/introduction/preface', 'Preface'],
          ['/introduction/use-cases', 'Use cases'],
          ['/introduction/queries-and-mutations', 'Queries and mutations'],
        ]
      },
      {
        title: 'Getting started',
        children: [
          '/getting-started/requirements',
          '/getting-started/installation',
          '/getting-started/creating-assets',
          '/getting-started/atomic-swaps',
          '/getting-started/deployment',
        ]
      },
      {
        title: 'API',
        children: [
          '/api/asset-design'
        ]
      },
      {
        title: 'Providers',
        children: [
          '/providers/ethereum'
        ]
      },
    ]
  },
  markdown: {
    lineNumbers: true
  }
}