import { EventEmitter } from "events";
import { MutationEvent } from "./types";
import { Mutation } from "./mutation";

/**
 * 
 */
export class MutationEmitter extends EventEmitter {

  /**
   * 
   */
  public emit(event: MutationEvent.CONFIRM, mutation: Mutation);
  public emit(event: MutationEvent.RESOLVE, mutation: Mutation);
  public emit(event: MutationEvent.ERROR, error: any);
  public emit(...args) {
    return super.emit.call(this, ...args);
  }

  /**
   * 
   */
  public on(event: MutationEvent.CONFIRM, handler: (m: Mutation) => any);
  public on(event: MutationEvent.RESOLVE, handler: (m: Mutation) => any);
  public on(event: MutationEvent.ERROR, handler: (e: any) => any);
  public on(...args) {
    return super.on.call(this, ...args);
  }

  /**
   * 
   */
  public once(event: MutationEvent.CONFIRM, handler: (m: Mutation) => any);
  public once(event: MutationEvent.RESOLVE, handler: (m: Mutation) => any);
  public once(event: MutationEvent.ERROR, handler: (e: any) => any);
  public once(...args) {
    return super.once.call(this, ...args);
  }

  /**
   * 
   */
  public off(event: MutationEvent, handler?: () => any) {
    if (handler) {
      return super.off(event, handler);
    }
    else {
      return super.removeAllListeners(event);
    }
  }

}