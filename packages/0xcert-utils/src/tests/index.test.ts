import { Spec } from '@hayspec/spec';
import * as rawmodel from '..';

const spec = new Spec();

spec.test('exposes objects', (t) => {
  t.true(!!rawmodel.isArray);
  t.true(!!rawmodel.isBoolean);
  t.true(!!rawmodel.isClassOf);
  t.true(!!rawmodel.isDate);
  t.true(!!rawmodel.isDeepEqual);
  t.true(!!rawmodel.isFloat);
  t.true(!!rawmodel.isFunction);
  t.true(!!rawmodel.isInfinite);
  t.true(!!rawmodel.isInstanceOf);
  t.true(!!rawmodel.isInteger);
  t.true(!!rawmodel.isNull);
  t.true(!!rawmodel.isNumber);
  t.true(!!rawmodel.isObject);
  t.true(!!rawmodel.isPresent);
  t.true(!!rawmodel.isString);
  t.true(!!rawmodel.isUndefined);
  t.true(!!rawmodel.isValue);
  t.true(!!rawmodel.normalize);
  t.true(!!rawmodel.realize);
  t.true(!!rawmodel.toArray);
  t.true(!!rawmodel.toBoolean);
  t.true(!!rawmodel.toDate);
  t.true(!!rawmodel.toFloat);
  t.true(!!rawmodel.toInteger);
  t.true(!!rawmodel.toNumber);
  t.true(!!rawmodel.toString);
});

export default spec;
