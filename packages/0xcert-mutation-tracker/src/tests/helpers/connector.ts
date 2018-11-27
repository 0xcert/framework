import { ConnectorBase, Mutation } from '@0xcert/scaffold';

export class FaceConnector implements ConnectorBase {
  public confirmations: number;

  public async sign(val: string) {
    return null;
  }

  public async getMutation(id: string) {
    return { id, confirmations: this.confirmations };
  }

  public async getOrderGateway(id: string) {
    return null;
  }

  public async getAssetLedger(ledgerId: any) {
    return null;
  }

  public async getValueLedger(ledgerId: any) {
    return null;
  }

  public async createQueue(schema: any) {
    return null;
  }

}
