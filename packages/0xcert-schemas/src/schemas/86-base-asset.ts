import erc721 from './erc721';

export default {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    $evidence: {
      description: 'A path to the evidence JSON with data needed to verify the asset.',
      type: 'string'
    },
    $schema: {
      description: 'A path to JSON Schema definition file.',
      type: 'string'
    },
    ...erc721.properties,
  },
  exposed: [
    'description',
    'image',
    'name'
  ],
  required: [
    'description',
    'image',
    'name'
  ],
  title: 'Base Asset',
  type: 'object',
}
