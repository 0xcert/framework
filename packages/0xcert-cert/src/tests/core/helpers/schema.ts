/**
 * JSON Schema example.
 */
export const exampleSchema = {
  type: 'object',
  properties: {
    'books': {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          'note': {
            type: 'string',
          },
          'title': {
            type: 'string',
          },
        },
      },
    },
    'email': {
      type: 'integer',
    },
    'event': {
      type: 'object',
      properties: {
        'organizer': {
          type: 'object',
          properties: {
            'email': {
              type: 'string',
            },
            'name': {
              type: 'string',
            },
          },
        },
        'title': {
          type: 'string',
        },
      },
    },
    'name': {
      type: 'string',
    },
    'tags': {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  },
};

/**
 * Data for example schema.
 */
export const exampleData = {
  books: [
    {
      note: 'A0',
      title: 'B0',
    },
    {
      note: 'A1',
      title: 'B1',
    },
  ],
  email: 'A',
  event: {
    organizer: {
      email: 'A',
      name: 'B',
    },
    title: 'A',
  },
  name: 'B',
  tags: [1, 2],
};

/**
 * Pictures array JSON schema
 */
export const pictureSchema = {
  '$schema': 'http://json-schema.org/draft-07/schema',
  'description': 'An abstract digital asset schema.',
  'properties': {
    '$evidence': {
      'description': 'A URI pointing to the evidence JSON with data needed to certify this asset.',
      'type': 'string',
    },
    '$schema': {
      'description': 'A path to JSON Schema definition file.',
      'type': 'string',
    },
    'name': {
      'description': 'A property that holds a name of an asset.',
      'type': 'string',
    },
    'description': {
      'description': 'A property that holds a detailed description of an asset.',
      'type': 'string',
    },
    'image': {
      'description': 'A public property that can be a valid URI pointing to a resource with mime type image/* representing the asset to which this digital assets represents. Consider making any images at a width between 320 and 1080 pixels and aspect ratio between 1.91:1 and 4:5 inclusive.',
      'type': 'string',
    },
    'pictures': {
      'type': 'array',
      'title': 'Pictures',
      'items': {
        'type': 'object',
        'properties': {
          'src': {
            'type': 'string',
            'title': 'Picture URL',
            'description': 'url',
          },
        },
      },
    },
  },
  'title': 'Asset',
  'type': 'object',
  'required': ['$schema'],
};
