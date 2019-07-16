
import { GenericProvider } from '@0xcert/ethereum-generic-provider';
import { GatewayBase, MutationBase, Order } from '@0xcert/scaffold';

export class GatewayMock implements GatewayBase {

  public id: string;
  public provider: GenericProvider;

  public constructor(provider: GenericProvider, id: string) {
    this.id = id;
    this.provider = provider;
  }

  public claim(order: Order): Promise<string> {
    throw new Error('Method not implemented.');
  }
  public perform(order: Order, claim: string): Promise<MutationBase> {
    throw new Error('Method not implemented.');
  }
  public cancel(order: Order): Promise<MutationBase> {
    throw new Error('Method not implemented.');
  }

  public async getProxyAccountId(proxyId: any) {
    const functionSignature = '0xabd90f85';
    const inputTypes = ['uint8'];
    const outputTypes = ['address'];
    try {
      const attrs = {
        to: this.id,
        data: functionSignature + this.provider.encoder.encodeParameters(inputTypes, [proxyId]).substr(2),
      };
      const res = await this.provider.post({
        method: 'eth_call',
        params: [attrs, 'latest'],
      });
      return this.provider.encoder.decodeParameters(outputTypes, res.result)[0];
    } catch (error) {
      return null;
    }
  }

}
