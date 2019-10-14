import { SchemaErc721, schemaErc721 } from './erc721';

/**
 * Base asset data object interface.
 */
export interface Schema86 extends SchemaErc721 {
  $evidence?: string;
  $schema: string;
  description?: string;
  image?: string;
  name?: string;
}

/**
 * Base asset data object JSON Schema.
 */
export const schema86 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    $evidence: {
      description: 'A path to the evidence JSON with data needed to verify the asset.',
      type: 'string',
    },
    $schema: {
      description: 'A path to JSON Schema definition file.',
      type: 'string',
    },
    ...schemaErc721.properties,
  },
  required: ['$schema'],
  title: 'Base Asset',
  type: 'object',
};
