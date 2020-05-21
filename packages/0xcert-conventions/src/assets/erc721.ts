/**
 * ERC-721 unique asset data object interface.
 */
export interface SchemaErc721 {

  /**
   * Any other key is allowed.
   */
  [key: string]: any;

  /**
   * A detailed description of an asset.
   */
  description?: string;

  /**
   * A valid URI pointing to a resource with mime type image/* representing the
   * asset to which this NFT represents. Consider making any images at a width
   * between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.
   */
  image?: string;

  /**
   * A name of an asset.
   */
  name?: string;
}

/**
 * ERC-721 unique asset JSON Schema.
 */
export const schemaErc721 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    description: {
      description: 'A public property of type string that holds a detailed description of an asset. The property is always required and is limited to 255 characters.',
      type: 'string',
    },
    image: {
      description: 'A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this NFT represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.',
      type: 'string',
    },
    name: {
      description: 'A public property that holds a name of an asset. This property is required and is limited to 255 characters.',
      type: 'string',
    },
  },
  title: 'Unique Asset',
  type: 'object',
};
