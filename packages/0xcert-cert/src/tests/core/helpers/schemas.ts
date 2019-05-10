/**
 * JSON Schema example.
 */
export const defaultSchema = {
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
export const defaultData = {
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
