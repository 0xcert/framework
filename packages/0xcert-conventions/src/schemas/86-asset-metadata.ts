export default {
  $schema: 'http://json-schema.org/draft-07/schema#',
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
    description: {
      description: 'A public property of type string that holds a detailed description of an asset. The property is always required and is limited to 255 characters.',
      type: 'string'
    },
    image: {
      description: 'A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.',
      type: 'string'
    },
    name: {
      description: 'A public property that holds a name of an asset. This property is required and is limited to 255 characters.',
      type: 'string'
    }
  },
  title: 'Asset',
  type: 'object',
}
