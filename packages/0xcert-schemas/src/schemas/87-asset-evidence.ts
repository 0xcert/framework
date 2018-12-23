export default {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'The evidence file with data to verify the asset data.',
  properties: {
    nodes: {
      description: '...',
      type: '...'
    },
    imprints: {
      description: '...',
      type: '...'
    },
    values: {
      description: '...',
      type: '...'
    }
  },
  require: [
    'nodes',
    'imprints',
    'values'
  ],
  title: 'Asset Evidence',
  type: 'object'
}
