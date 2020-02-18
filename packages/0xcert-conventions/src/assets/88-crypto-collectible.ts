import { Schema86, schema86 } from './86-base-asset';

/**
 * Crypto collectible asset data object interface.
 */
export interface Schema88 extends Schema86 {
  $evidence?: string;
  $schema: string;
  description: string;
  image: string;
  name: string;
}

/**
 * Crypto collectible asset data object JSON Schema.
 */
export const schema88 = {
  $schema: 'https://conventions.0xcert.org/xcert-schema.json',
  description: 'An abstract digital asset schema.',
  properties: {
    ...schema86.properties,
  },
  title: 'Crypto Collectible',
  type: 'object',
};
