/**
 * Xcert JSON Schema interface.
 */
export type XcertSchema = {
  $schema: 'https://conventions.0xcert.org/json-schema.json';
  description: string;
  properties: {
    [key: string]: XcertSchemaPrimitive | XcertSchemaObject | XcertSchemaArray;
  };
  type: 'object';
  title: string;
  [key: string]: any;
} | {
  $schema: 'https://conventions.0xcert.org/json-schema.json';
  description: string;
  items: XcertSchemaPrimitive | XcertSchemaObject;
  type: 'array';
  title: string;
  [key: string]: any;
};

/**
 * Xcert JSON Schema object interface.
 */
export interface XcertSchemaObject {
  description?: string;
  properties: {
    [key: string]: XcertSchemaPrimitive | XcertSchemaObject | XcertSchemaArray;
  };
  type: 'object';
  [key: string]: any;
}

/**
 * Xcert JSON Schema array interface.
 */
export interface XcertSchemaArray {
  description?: string;
  items: XcertSchemaPrimitive | XcertSchemaObject;
  type: 'array';
  [key: string]: any;
}

/**
 * Xcert JSON Schema primitive value interface.
 */
export interface XcertSchemaPrimitive {
  description?: string;
  type: 'string' | 'number' | 'boolean';
  [key: string]: any;
}

/**
 * Xcert Xcert JSON Schema definition.
 */
export const xcertSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema#',
  'title': 'Core schema meta-schema',
  'definitions': {
    'stringSchema': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string',
          'enum': ['string'],
        },
      },
    },
    'numberSchema': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string',
          'enum': ['number'],
        },
      },
    },
    'booleanSchema': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string',
          'enum': ['boolean'],
        },
      },
    },
    'objectSchema': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string',
          'enum': ['object'],
        },
        'properties': {
          'patternProperties': {
            '^.*$': {
              'anyOf': [
                { '$ref': '#/definitions/objectSchema' },
                { '$ref': '#/definitions/arraySchema' },
                { '$ref': '#/definitions/stringSchema' },
                { '$ref': '#/definitions/numberSchema' },
                { '$ref': '#/definitions/booleanSchema' },
              ],
            },
          },
        },
      },
    },
    'arraySchema': {
      'type': 'object',
      'properties': {
        'type': {
          'type': 'string',
          'enum': ['array'],
        },
        'items': {
          'anyOf': [
            { '$ref': '#/definitions/objectSchema' },
            { '$ref': '#/definitions/stringSchema' },
            { '$ref': '#/definitions/numberSchema' },
            { '$ref': '#/definitions/booleanSchema' },
          ],
        },
      },
    },
    'simpleTypes': {
      'enum': [
        'array',
        'boolean',
        'integer',
        'null',
        'number',
        'object',
        'string',
      ],
    },
  },
  'type': ['object', 'boolean'],
  'properties': {
    '$schema': {
      'type': 'string',
      'format': 'uri',
    },
    '$evidence': {
      'type': 'string',
      'format': 'uri',
    },
    'title': {
      'type': 'string',
    },
    'description': {
      'type': 'string',
    },
    'type': {
      'type': 'string',
      'enum': ['object'],
    },
    'items': {
      'anyOf': [
        { '$ref': '#/definitions/objectSchema' },
        { '$ref': '#/definitions/stringSchema' },
        { '$ref': '#/definitions/numberSchema' },
        { '$ref': '#/definitions/booleanSchema' },
      ],
    },
    'properties': {
      'patternProperties': {
        '^.*$': {
          'anyOf': [
            { '$ref': '#/definitions/objectSchema' },
            { '$ref': '#/definitions/arraySchema' },
            { '$ref': '#/definitions/stringSchema' },
            { '$ref': '#/definitions/numberSchema' },
            { '$ref': '#/definitions/booleanSchema' },
          ],
        },
      },
    },
  },
};
