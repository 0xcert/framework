import { Spec } from '@hayspec/spec';

const spec = new Spec();

spec.test('aaa bbb ccc', (ctx) => {

  const convention = {
    type: 'object',
    properties: {
      'name': {
        type: 'string',
      },
      'tags': {
        type: 'array',
        items: {
          type: 'string',
        },
      },
      'book': {
        type: 'object',
        properties: {
          'title': {
            type: 'string'
          },
        },
      },
      'books': {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            'title': {
              type: 'string',
            },
          },
        },
      },
    },
  };

  function flatten(prepend, schema, json) {
    if (schema.type === 'array') {
      return (json || []).map((v, i) => {
        return flatten([...prepend, i], schema.items, v);
      }).reduce((a, b) => a.concat(b), []);
    }
    else if (schema.type === 'object') {
      return Object.keys(schema.properties).map((key) => {
        return flatten([...prepend, key], schema.properties[key], (json || {})[key]);
      }).reduce((a, b) => a.concat(b), []);
    }
    else {
      return {
        path: prepend,
        value: json,
      };
    }
  }

  function getValue(path, json) {
    if (!Array.isArray(path)) {
      return undefined;
    }
    else if (path.length === 0) {
      return json;
    }
    else {
      return getValue(path.slice(1), json[path[0]]);
    }
  }

  console.log();
  console.log('-------');
  // console.log(
  //   flatten([], convention, {
  //     name: 'Foo',
  //     book: {
  //       title: 'Bar',
  //     },
  //     tags: [1],
  //     books: [
  //       {
  //         title: 'Baz',
  //       },
  //     ],
  //   })
  // );
  // console.log(
  //   getValue(['books', 0, 'title'], {
  //     name: 'Foo',
  //     book: {
  //       title: 'Bar',
  //     },
  //     tags: [1],
  //     books: [
  //       {
  //         title: 'Baz',
  //       },
  //     ],
  //   })
  // );
  console.log('-------');

});

export default spec;
