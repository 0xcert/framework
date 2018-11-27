import { EventEmitter } from "events";
import { ProviderEvent } from "./types";

/**
 * 
 */
export class ProviderEmitter extends EventEmitter {

  /**
   * 
   */
  public emit(event: ProviderEvent) {
    return super.emit(event);
  }

  /**
   * 
   */
  public on(event: ProviderEvent, handler: () => any) {
    return super.on(event, handler);
  }

  /**
   * 
   */
  public once(event: ProviderEvent, handler: () => any) {
    return super.once(event, handler);
  }

  /**
   * 
   */
  public off(event: ProviderEvent, handler?: () => any) {
    if (handler) {
      return super.off(event, handler);
    }
    else {
      return super.removeAllListeners(event);
    }
  }

}