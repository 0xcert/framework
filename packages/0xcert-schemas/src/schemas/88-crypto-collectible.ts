import assetMetadata from './86-asset-metadata';

export default {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    ...assetMetadata.properties,
  },
  title: 'Crypto Collectible',
  type: 'object',
}
