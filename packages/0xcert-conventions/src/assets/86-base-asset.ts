import { ObjectErc721, schemaErc721 } from './erc721';

/**
 * Base asset data object interface.
 */
export interface Object86 extends ObjectErc721 {
  _evidence?: string;
  _schema?: string;
  description?: string;
  image?: string;
  name?: string;
}

/**
 * Base asset data object JSON Schema.
 */
export const schema86 = {
  _schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    _evidence: {
      description: 'A path to the evidence JSON with data needed to verify the asset.',
      type: 'string',
    },
    _schema: {
      description: 'A path to JSON Schema definition file.',
      type: 'string',
    },
    ...schemaErc721.properties,
  },
  title: 'Base Asset',
  type: 'object',
};
