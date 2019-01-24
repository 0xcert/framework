import { Object86, schema86 } from './86-base-asset';

/**
 * Crypto collectible asset data object interface.
 */
export interface Object88 extends Object86 {
  $evidence?: string;
  $schema?: string;
  description: string;
  image: string;
  name: string;
}

/**
 * Crypto collectible asset data object JSON Schema.
 */
export const schema88 = {
  $schema: 'http://json-schema.org/draft-07/schema',
  description: 'An abstract digital asset schema.',
  properties: {
    ...schema86.properties,
  },
  title: 'Crypto Collectible',
  type: 'object',
};
