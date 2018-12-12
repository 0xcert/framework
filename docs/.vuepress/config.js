module.exports = {
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
  }
}