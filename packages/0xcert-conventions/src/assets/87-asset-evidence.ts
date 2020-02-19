/**
 * Asset evidence object interface.
 */
export interface Schema87 {
  $schema: string;
  data: {
    nodes: {
      index: number;
      hash: string;
    }[];
    path: (string | number)[];
    values: {
      index: number;
      value: string;
      nonce: string;
    }[];
  }[];
}

/**
 * Asset evidence JSON Schema.
 */
export const schema87 = {
  $schema: 'https://conventions.0xcert.org/xcert-schema.json',
  description: 'Asset evidence schema.',
  properties: {
    $schema: {
      description: 'A path to JSON Schema definition file.',
      type: 'string',
    },
    data: {
      description: 'Asset data evidence.',
      items: {
        type: 'object',
        properties: {
          nodes: {
            description: 'A list of binary tree hash values.',
            items: {
              properties: {
                index: {
                  description: 'A number representing the hash index in a binary tree.',
                  type: 'integer',
                },
                hash: {
                  description: 'A string representing the hash value in a binary tree.',
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
          path: {
            description: 'A list of keys representing the JSON path.',
            items: {
              type: 'string',
            },
            type: 'array',
          },
          values: {
            description: 'A list of binary tree values.',
            items: {
              properties: {
                index: {
                  description: 'A number representing the value index in a binary tree.',
                  type: 'integer',
                },
                value: {
                  description: 'A string representing the value in a binary tree.',
                  type: 'string',
                },
                nonce: {
                  description: 'A string representing value secret.',
                  type: 'string',
                },
              },
              type: 'object',
            },
            type: 'array',
          },
        },
      },
      type: 'array',
    },
  },
  title: 'Asset evidence',
  type: 'object',
};
