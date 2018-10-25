import { isFunction } from './is-function';

/**
 * Executes the value if the value is a function otherwise the value is returned.
 * @param value Function or a value.
 * @param context Value function context.
 * @param args Value function arguments.
 */
export function realize(value: any, context?: any, args?: any[]) {
  return isFunction(value)
    ? value.call(context, ...args)
    : value;
}
