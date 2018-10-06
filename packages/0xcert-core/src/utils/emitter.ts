/**
 * 
 */
export class EventEmitter {
  readonly listeners = new Map();

  /**
   * 
   */
  public on(label, callback) {
    this.listeners.has(label) || this.listeners.set(label, []);
    this.listeners.get(label).push(callback);
  }

  /**
   * 
   */
  public off(label, callback) {
    const listeners = this.listeners.get(label);
      
    if (listeners && listeners.length) {
      const index = listeners.reduce((i, listener, index) => (
        typeof listener === 'function' && listener === callback ? i = index : i
      ), -1);
      
      if (index > -1) {
        listeners.splice(index, 1);
        this.listeners.set(label, listeners);
        return true;
      }
    }
    return false;
  }

  /**
   * 
   * @param label 
   * @param args 
   */
  public emit(label, ...args) {
    const listeners = this.listeners.get(label);
    
    if (listeners && listeners.length) {
      listeners.forEach((listener) => listener(...args));
      return true;
    } else {
      return false;
    }
  }

}