import { Client } from '@0xcert/client'
import { Connector } from '@0xcert/web3-connector'
import * as Web3 from 'web3';

/**
 * 
 */
const web3Instance = new Web3(ethereum)

/**
 * 
 */
const connector = new Connector({ web3: web3Instance, signMethod: 2 })
connector.isSupported = function() {
  return (
    typeof window !== 'undefined'
    && typeof window['ethereum'] !== 'undefined'
  );
}
connector.isEnabled = async function() {
  return (
    this.isSupported()
    && await window['ethereum']._metamask.isApproved()
    && !!this.context.myId
  );
}
connector.enable = async function() {
  if (this.isSupported()) {
    this.context.myId = await window['ethereum'].enable().then((a) => a[0]);
  }
  return this;
}

/**
 * 
 */
export default {
  install(Vue) {
    const client = new Client({ connector })
    Vue.prototype.$0xcert = client;
  }
}

/*
* The plugin is automatically installed when loaded in browser (not as module).
*/
if (typeof window !== 'undefined' && !!window['Vue']) {
  window['Vue'].use(VueRawModel);
}
