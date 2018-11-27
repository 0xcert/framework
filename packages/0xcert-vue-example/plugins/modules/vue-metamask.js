import { MetamaskProvider, ProviderEvent } from '@0xcert/ethereum-metamask-provider'

/**
 * 
 */
const VueMetamask = {
  install(Vue) {

    const provider = new MetamaskProvider();
    provider.on(ProviderEvent.NETWORK_CHANGE, () => console.log('NETWORK_CHANGED'));
    provider.on(ProviderEvent.ACCOUNT_CHANGE, () => console.log('ACCOUNT_CHANGED'));

    Vue.prototype.$ethereum = provider;
  }
}

/**
 * 
 */
export default VueMetamask

/*
* The plugin is automatically installed when loaded in browser (not as module).
*/
if (typeof window !== 'undefined' && !!window['Vue']) {
  window['Vue'].use(VueMetamask);
}
