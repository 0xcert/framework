export const exampleSchema = {
  type: 'object',
  properties: {
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
