Model is a strongly-typed JavaScript object with support for validation and error handling. It's a lightweight open source framework for the **server** and **browser** (using module bundler), written with [TypeScript](https://www.typescriptlang.org). It's build on top of [RawModelJS](https://Model.github.io/framework/) and thus provides all the power of that library.

## Introduction

AssetModel provides a mechanism for creating strongly-typed data objects with built-in logic for unified data validation and error handling. It has a simple and intuitive API and tends to be a powerful, magic-free, minimalistic and unopinionated framework for writing application data layers where you have a complete control. It could be a perfect fit when writing an [Express.js](http://expressjs.com/) action, [GraphQL](http://graphql.org/) resolver or similar and it's easily extendable.

## Installation

Run the command below to install the package.

```
$ npm install --save @0xcert/asset-model
```

This package uses promises thus you need to use [Promise polyfill](https://github.com/taylorhakes/promise-polyfill) when promises are not supported.

## Example

The code below shows a basic usage example.

```ts
import { Model, prop } from '@0xcert/asset-model';

// defining a basic model
class User extends Model {
  @prop()
  name: string;
}

// usage example
const model = new User({
  'name': 'John Smith'
});
model.name; // => 'John Smith'
```

## Usage

Below we explain some of the most important features that this framework provides. Please check the API section to see a complete list of features.

### Defining Props

Model properties are defined using the `prop` ES6 decorator. The code below is an example of a basic model class with a `name` property.

```ts
import { Model, prop } from 'Model';

class User extends Model {
  @prop()
  name: string;
}

const user = new User();
user.name = 'John Smith';
user.name; // -> "John Smith"
```

### Type Casting

Each property has a built-in system for type casting, thus we can force a value to be automatically converted to a specific type when setting a value.

```ts
@prop({
  cast: { handler: 'String' },
})
name: string;
```

Common types are supported by default. The `Model` also represents a type handler.

```ts
class User extends Model {}
...
@prop({
  cast: { handler: User, array: true },
})
user: User[];
```

You can use your own handler function. Please see the API section for further details.

### Nested Models

As mentioned above, a model class is already a type handler. This way you can create complex nested structures by nesting models as shown in the example below.

```ts
class Book extends Model {
  @prop()
  title: string;
}

class User extends Model {
  @prop({
    cast: { handler: Book },
  })
  book: Book;
}
```

### Prop Default Value

We can set a `defaultValue` for each property which will automatically populate a property on creation.

The `defaultValue` can also be a method which returns a dynamic value. This function shares the context of a property instance thus you have access to all the features of the `Prop` class.

```ts
@prop({
  defaultValue() { return new Date() },
})
now: string;
```

### Prop Fake Value

Similar to default values, we can set a `fakeValue` for each property, to populate a property with fakes data when calling the `fake()` method.

The `fakeValue` can also be a method which returns a dynamic value. This function shares the context of a property instance, thus you have access to all the features of the `Prop` class.

```ts
@prop({
  fakeValue() { return new Date() },
})
today: string;
```

### Prop Empty Value

By default, all defined properties are set to `null`. Similar to default and fake value we can set an `emptyValue` option for each property, to automatically replace `null` values.

The `emptyValue` can also be a method which returns a dynamic value. Note that this function shares the context of a property instance, thus you have access to all the features of the `Prop` class.

```ts
@prop({
  fakeValue() { return '' },
})
name: string;
```

### Prop Value Transformation

A property can have a custom `getter` and a custom `setter`. These methods all share the context of a property instance, thus you have access to all the features of the `Prop` class.

```ts
@prop({
  get(value) { return value },
  set(value) { return value },
})
name: string;
```

### Value Assignments

Model's properties are like properties on a Javascript Object. We can easily assign a value to a property through its setter method (e.g. `model.name = 'value';`). Instead of assigning properties one by one, we can use the `populate()` method as shown below.

```ts
model.populate({
  'name': 'John Smith',
  'age': 35,
});
```

We can allow only selected properties to be populated by using population strategies (e.g. populating data received from a form ).

```ts
class User extends Model {
  @prop({
    populatable: ['internal'], // list population strategy names
  })
  id: string;
  @prop({
    populatable: ['input', 'internal'], // list population strategy names
  })
  name: string;
}

const data = {
  'id': 100,
  'name': 'John Smith'
};
const user = new User();
user.populate(data); // -> { "id": 100, "name": "John Smith" }
user.populate(data, 'internal'); // -> { "id": 100, "name": "John Smith" }
user.serialize(data, 'input'); // -> { id: null, "name": "John Smith" }
```

### Serialization & Filtering

Model provides useful methods for object serialization and filtering (check the API for more methods).

```ts
const user = new User({
  'name': 'John Smith', // initial value
});

user.scroll(function(property) { // argument is an instance of a property
  // do something useful
}).then((count) => { // number of processed properties
  user.serialize(); // -> { "name": "John Smith" }
});
```

Props are serializable by default and are thus included in the result object returned by the `serialize()` method. We can customize the output and include or exclude properties for different occasions by using serialization strategies.

```ts
class User extends Model {
  @prop({
    serializable: ['output'], // list serialization strategy names
  })
  id: string;
  @prop({
    serializable: ['input', 'output'], // list serialization strategy names
  })
  name: string;
}

const user = new User({
  'id': 100,
  'name': 'John Smith',
});
user.serialize(); // -> { "id": 100, "name": "John Smith" }
user.serialize('input'); // -> { "name": "John Smith" }
user.serialize('output'); // -> { "id": 100, "name": "John Smith" }
```

### Commits & Rollbacks

Model tracks changes for all properties and provides a mechanism for committing values and rollbacks.

```ts
class User extends Model {
  @prop()
  name: string;
}

const user = new User();
user.name = 'Mandy Taylor'; // changing property's value
user.isChanged(); // -> true
user.commit(); // set `initialValue` of each property to the value of  `value`
user.isChanged(); // -> false
user.name = 'Tina Fey'; // changing property's value
user.rollback(); // -> reset `value` of each property to its `initialValue` (last committed value)
```

Note that the `commit` method will memorize a serialized data and the `rollback` method will apply it back. Assigning functions or instances to properties is discourages.

### Validation

Model provides a simple mechanism for validating properties.

```ts
class User extends Model {
  @prop({
    validate: [ // property validation setup
      { // validator recipe
        handler: (v) => !!v, // [required] validator function
        code: 422, // [optional] error code
        condition() { return true }, // [optional] condition which switches the validation on/off
      },
    ],
  })
  name: string;
}

const user = new User();
user.validate().catch((err) => {
  user.collectErrors(); // -> [{path: ['name'], errors: [{validator: 'presence', message: 'is must be present', code: 422}]}]
});
```

### Error Handling

Model provides a mechanism for handling property-related errors. The logic is aligned with the validation thus the validation and the error handling can easily be managed in a unified way. This is great because we always deal with validation errors and can thus directly send these errors back to a user in a unified format.

```ts
class User extends Model {
  @prop({
    handle: [ // property error handling setup
      { // handler recipe
        handler: (e) => e.message === 'foo', // [required] errir handler function
        code: 422, // [optional] error code
        condition() { return true }, // [optional] condition which switches the handling on/off
      },
    ],
  })
  name: string;
}

const error = new Error();
const user = new User();
user.handle(error).then(() => {
  user.collectErrors(); // -> [{ path: ['name'], errors: [{ handler: 'block', message: 'is unknown', code: 422 }] }]
});
```

This mechanism is especially handful when saving data to a database. MongoDB could, for example, throw a uniqueness error (E11000) if we try to insert a value that already exists in the database. We can catch that error by using the `handle()` method and then return a unified validation error message to a user.

### GraphQL

Model can be a perfect framework for writing GraphQL resolvers. An instance of a root model, in our case the `App` class, can represent GraphQL's `rootValue`.

```ts
import { Model } from 'Model';
import { graphql, buildSchema } from 'graphql';

class App extends Model { // root resolver
  public hello() { // `hello` property resolver
    return 'Hello World!';
  }
}

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = new App(); // root resolver

graphql(schema, '{ hello }', root).then((response) => {
  console.log(response);
});
```

## API

### Model Class

**Model(data, config)**

> Abstract class which represents a strongly-typed JavaScript object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Data for populating model properties.
| config.ctx | Any | No | - | Model context
| config.failFast | Boolean | No | false | When `true` the validation and error handling stops when the first error is found.
| config.parent | Model | Only when used as a submodel | - | Parent model instance.

```ts
class User extends Model {
  @prop({
    set(v) { return v; }, // [optional] custom setter
    get(v) { return v; }, // [optional] custom getter
    cast: { // [optional] property type casting
      handler(v) { return `${v}`; }, // [optional] type handler function
      array: false, // [optional] force to array type
    },
    defaultValue: 'Noname', // [optional] property default value (value or function)
    fakeValue: 'Noname', // [optional] property fake value (value or function)
    emptyValue: '', // [optional] property empty value (value or function)
    validate: [ // [optional] value validator recipes
      { // validator recipe (check validatable.js for more)
        handler(v) { return !!v; }, // [required] validator function (supports async)
        condition(v) { return true; }, // [optional] condition which switches the validation on/off
        code: 422, // [optional] error code
      },
    ],
    handle: [ // [optional] error handling recipies
      { // handler recipe
        handler(e) { return e.message === 'foo'; }, // [required] error handler function (supports async)
        condition(e) { return true; }, // [optional] condition which switches the handling on/off
        code: 422, // [optional] error code
      },
    ],
    populatable: ['input', 'internal'], // [optional] population strategies
    serializable: ['input', 'output'], // [optional] serialization strategies
    enumerable: true, // [optional] when set to `false` the property is not enumerable (ignored by `Object.keys()`)
  })
  name: string; // [required] typescript property definition
}
```

**Model.@prop(config)**

> Model property decorator

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| config.set | Function | No | - | Custom setter.
| config.get | Function | No | - | Custom getter.
| config.cast.handler | String, Model | No | - | Data type handler (pass a Model to create a nested structure).
| config.cast.array | Boolean | No | false | Force array type.
| config.defaultValue | Any | No | - | Prop default value.
| config.fakeValue | Any | No | - | Prop fake value.
| config.emptyValue | Any | No | - | Prop empty value.
| config.validate | Array | No | - | List of validator recipes.
| config.handle | Array | No | - | List of error handler recipes.
| config.populatable | String[] | No | - | List of strategies for populating the property value.
| config.serializable | String[] | No | - | List of strategies for serializing the property value.
| config.enumerable | Boolean | No | true | Indicates that the property is enumerable.

**Model.prototype.$config**: Object

> Model configuration data.

**Model.prototype.$props**: Object

> Model property instances.

**Model.prototype.applyErrors(errors)**: Model

> Deeply populates properties with the provided `errors`.

```ts
model.applyErrors([
  {
    path: ['books', 1, 'title'], // property path
    errors: [422, 500], // error codes
  },
]);
```

**Model.prototype.clone(data)**: Model

> Returns a new Model instance which is the exact copy of the original.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | No | - | Data to override initial data.

**Model.prototype.collect(handler)**: Array

> Scrolls through model properties and collects results.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each property.

**Model.prototype.collectErrors()**: Array

> Returns a list of errors for all the properties ({path, errors}[]).

```ts
model.collectErrors(); // => { path: ['name'], errors: [{ validator: 'absence', message: 'must be blank', code: 422 }] }
```

**Model.prototype.commit()**: Model

> Sets initial value of each model property to the current value of a property. This is how property change tracking is restarted.

**Model.prototype.empty()**: Model

> Sets all model properties to `null`.

**Model.prototype.fake()**: Model

> Sets each model property to its fake value if the fake value generator is defined.

**Model.prototype.filter(handler)**: Object

> Converts a model into serialized data object with only the keys that pass the test.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A function to test each key value. If the function returns `true` then the key is included in the returned object.

**Model.prototype.flatten()**: Array

> Converts the model into an array of properties.

```ts
user.flatten(); // -> [{ path: [...], property: ... }, ...]
```

**Model.prototype.getParent()**: Model

> Returns the parent model instance in a tree of models.

**Model.prototype.getProp(...keys)**: Prop

> Returns a class instance of a property at path.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a property (e.g. `['book', 0, 'title']`).

**Model.prototype.getRoot()**: Model

> Returns the first model instance in a tree of models.

**Model.prototype.handle(error, { quiet }): Promise(Model)**

> Tries to handle the `error` against each property handlers and populates the model with possible errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.
| quiet | Boolean | No | true | When set to `false`, a handled validation error is thrown. This doesn't affect the unhandled errors (they are always thrown).

```ts
try {
  await model.validate(e); // imagine it throws an error
} catch (e) {
  await model.handle(e);
}
```

**Model.prototype.isChanged()**: Boolean

> Returns `true` if at least one model property has been changed.
]

**Model.prototype.isEqual(value)**: Boolean

> Returns `true` when the provided `value` represents an object with the same properties as the model itself.

**Model.prototype.isProp(...keys)**: Boolean

> Returns `true` when a property path exists.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| keys | Array | Yes | - | Path to a property (e.g. `['book', 0, 'title']`).

**Model.prototype.isValid()**: Boolean

> Returns `true` when all model properties are valid. Make sure that you call the `validate()` method first.

**Model.prototype.invalidate()**: Model

> Clears `errors` on all properties.

**Model.prototype.populate(data, strategy)**: Model

> Applies data to a model.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| data | Object | Yes | - | Data object.
| strategy | String | No | - | When the strategy name is provided, only the properties where the `populatable` option includes this strategy name are populated. If the parameter is not provided then all properties are included in the process.

**Model.prototype.reset()**: Model

> Sets each model property to its default value.

**Model.prototype.rollback()**: Model

> Sets each model property to its initial value (last committed value). This is how you can discharge model changes.

**Model.prototype.scroll(handler)**: Integer

> Scrolls through model properties and executes a handler on each property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| handler | Function | Yes | - | A handler method which is executed for each property.

**Model.prototype.serialize(strategy)**: Object

> Converts a model into serialized data object.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | When the strategy name is provided, the output will include only the properties where the `serializable` option includes this strategy name. If the parameter is not provided then all properties are included in the result.

**Model.prototype.validate({ quiet })**: Promise(Model)

> Validates model properties, populates the model with possible errors and throws a validation error if not all properties are valid unless the `quiet` is set to `true`.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| quiet | Boolean | No | true | When set to `false`, a validation error is thrown.

```ts
try {
  await model.validate(); // throws a validation error when invalid properties exist
} catch (e) {
  // `e` is a 422 validation error
}
```

### Prop Class

**Prop(config)**

> A model property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| config.set | Function | No | - | Custom setter.
| config.get | Function | No | - | Custom getter.
| config.cast.handler | String, Model | No | - | Data type handler (pass a Model to create a nested structure).
| config.cast.array | Boolean | No | false | Force array type.
| config.defaultValue | Any | No | - | Prop default value.
| config.fakeValue | Any | No | - | Prop fake value.
| config.emptyValue | Any | No | - | Prop empty value.
| config.validator | Validator | No | Validator | Property validator instance.
| config.validate | Array | No | - | List of validator recipes.
| config.handler | Handler | No | Handler | Property error handler instance.
| config.handle | Array | No | - | List of error handler recipes.
| config.populatable | String[] | No | - | List of strategies for populating the property value.
| config.serializable | String[] | No | - | List of strategies for serializing the property value.
| config.enumerable | Boolean | No | true | Indicates that the property is enumerable.
| config.model | Model | No | null | Parent model instance.

**Prop.prototype.$config**: Object

> Property configuration object.

**Prop.prototype.empty()**: Prop

> Sets property and related sub-properties to `null`.

**Prop.prototype.commit()**: Prop

> Sets initial value to the current value. This is how property change tracking is restarted.

**Prop.prototype.fake()**: Prop

> Sets property to a generated fake value.

**Prop.prototype.getErrorCodes()**: Number[]

> List of property error codes (sets the `validate` method).

**Prop.prototype.getInitialValue()**: Any

> Returns property initial value.

**Prop.prototype.getValue()**: Any

> Returns current property value.

**Prop.prototype.getRawValue()**: Any

> Returns current property raw value.

**Prop.prototype.handle(error)**: Promise(Prop)

> Validates the `value` and populates the `errors` property with errors.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| error | Any | Yes | - | Error to be handled.

**Prop.prototype.isArray()**: Boolean

> Returns `true` if the property is an array.

**Prop.prototype.isEmpty()**: Boolean

> Returns `true` if the property has no value.

**Prop.prototype.isEqual(value)**: Boolean

> Returns `true` when the provided `value` represents an object that looks the same.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| value | Any | Yes | - | A value to compare to.

**Prop.prototype.isChanged()**: Boolean

> Returns `true` if the property or at least one sub-property have been changed.

**Prop.prototype.isModel()**: Boolean

> Returns `true` if the property is a nested model.

**Prop.prototype.isPopulatable(strategy)**: Boolean

> Returns `true` if the property can be set.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | Populating strategy.

**Prop.prototype.isSerializable(strategy)**: Boolean

> Returns `true` if the property can be serialized.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | Serialization strategy.

**Prop.prototype.isValid()**: Boolean

> Returns `true` if the property and all sub-properties are valid (inverse of `hasErrors()`). Make sure that you call the `validate()` method first.

**Prop.prototype.invalidate()**: Prop

> Clears the `errors` property on all properties (the reverse of `validate()`).

**Prop.prototype.reset()**: Prop

> Sets the property to its default value.

**Prop.prototype.rollback()**: Prop

> Sets the property to its initial value (last committed value). This is how you can discharge property's changes.

**Prop.prototype.serialize(strategy)**

> Returns a serialized property value.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| strategy | String | No | - | Serialization strategy.

**Prop.prototype.setValue(value)**

> Sets current property value.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| value | String | Yes | - | Arbitrary value.

**Prop.prototype.validate()**: Promise(Prop)

> Validates the `value` and populates the `errors` property with errors.

### Available Data Types

| Type | Description
|------|------------
| 'String' | String value.
| 'Boolean' | Boolean value.
| 'Number' | Integer or a float number.
| 'Integer' | Integer number.
| 'Float' | Float number.
| 'Date' | Date object.
| Model | Nested model instance.

### Available Validators

**absenceValidator()**: Function

> Validates that the specified property is blank.

```ts
import { absenceValidator } from '@Model/validators';

const recipe = {
  handler: absenceValidator(),
  code: 422,
};
```

**arrayExclusionValidator(options)**: Function

> Validates that the specified property is not in an array of values.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.values | Array | Yes | - | Array of restricted values.

**arrayInclusionValidator(options)**: Function

> Validates that the specified property is in an array of values.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.values | Array | Yes | - | Array of allowed values.

**arrayLengthValidator(options)**: Function

> Validates the size of an array.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.min | Number | No | - | Allowed minimum items count.
| options.minOrEqual | Number | No | - | Allowed minimum items count (allowing equal).
| options.max | Number | No | - | Allowed maximum items count.
| options.maxOrEqual | Number | No | - | Allowed maximum items count (allowing equal).

**base64Validator()**: Function

> Validates that the specified property is base64 encoded string.

**bsonObjectIdValidator()**: Function

> Validates that the specified property is BSON ObjectId encoded string.

**dateValidator(options)**: Function

> Validates that the specified property is a date string.

| Option | Type | Required | Default | Description
|--------|------|----------|----------|-----------
| options.iso | Boolean | No | false | When `true` only ISO-8601 date format is accepted.

**downcaseStringValidator()**: Function

> Validates that the specified property is lowercase.

**emailValidator(options)**: Function

> Validates that the specified property is an email.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.allowDisplayName | Boolean | No | false | When set to true, the validator will also match `name <address>`.
| options.allowUtf8LocalPart | Boolean | No | false | When set to false, the validator will not allow any non-English UTF8 character in email address' local part.
| options.requireTld | Boolean | No | true | When set to false, email addresses without having TLD in their domain will also be matched.

**ethAddressValidator()**: Function

> Checks if the string represents an Ethereum address.

**fqdnValidator(options)**: Function

> Validates that the specified property is a fully qualified domain name (e.g. domain.com).

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.requireTld | Boolean | No | true | Require top-level domain name.
| options.allowUnderscores | Boolean | No | false | Allow string to include underscores.
| options.allowTrailingDot | Boolean | No | false | Allow string to include a trailing dot.

**hexColorValidator()**: Function

> Validates that the specified property is a hexadecimal color string.

**hexValidator()**: Function

> Validates that a specified property is a hexadecimal number.

**jsonStringValidator(options)**: Function

> Validates that the specified property is a JSON string.

**matchValidator(options)**: Function

> Validates that the specified property matches the pattern.

| Key | Type | Required | Default | Description
|-----|------|----------|---------|------------
| options.regexp | RegExp | Yes | - | Regular expression pattern.

**numberSizeValidator(options)**: Function

> Validates the size of a number.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.min | Number | No | - | Allowed minimum value.
| options.minOrEqual | Number | No | - | Allowed minimum value (allowing equal).
| options.max | Number | No | - | Allowed maximum value.
| options.maxOrEqual | Number | No | - | Allowed maximum value (allowing equal).

**presenceValidator()**: Function

> Validates that the specified property is not blank.

**stringExclusionValidator(options)**: Function

> Checks if the string does not contain the seed.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.seed | String | Yes | - | The seed which should exist in the string.

**stringInclusionValidator()**: Function

> Checks if the string contains the seed.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.seed | String | Yes | - | The seed which should exist in the string.

**stringLengthValidator(options)**: Function

> Validates the length of the specified property.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.bytes | Boolean | No | false | When `true` the number of bytes is returned.
| options.min | Number | No | - | Allowed minimum number of characters.
| options.minOrEqual | Number | No | - | Allowed minimum value number of characters (allowing equal).
| options.max | Number | No | - | Allowed maximum number of characters.
| options.maxOrEqual | Number | No | - | Allowed maximum number of characters (allowing equal).

**upcaseStringValidator()**: Function

> Validates that the specified property is uppercase.

**uuidValidator(options)**: Function

> Validates that the specified property is a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier).

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.version | Integer | No | - | UUID version (1, 2, 3, 4 or 5).

### Available Handlers

**mongoUniquenessHandler(options)**: Function

> Checks if the error represents a MongoDB unique constraint error.

| Option | Type | Required | Default | Description
|--------|------|----------|---------|------------
| options.indexName | String | No | - | MongoDB collection's unique index name.

```js
import { mongoUniquenessHandler } from '@Model/handlers';

const recipe = { // make sure that this index name exists in your MongoDB collection
  handler: mongoUniquenessHandler({ indexName: 'uniqueEmail' }),
  code: 422,
};
```
