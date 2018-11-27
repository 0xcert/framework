import { Client } from './client'

/**
 * 
 */
export const Vue0xcert = {
  install(Vue, options) {
    Vue.prototype.$0xcert = new Client(options);
  }
}

/*
* The plugin is automatically installed when loaded in browser (not as module).
*/
if (typeof window !== 'undefined' && !!window['Vue']) {
  window['Vue'].use(Vue0xcert);
}
