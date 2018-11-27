<template>
  <div>
    <h2>Order Exchange</h2>
    <button @click="connect()">Connect Metamask</button>
    <button @click="claim()">Sign Order</button>
    <button @click="perform()">Execute Order</button>
    <button @click="cancel()">Cancel Order</button>
    <hr />
    <h2>Certification</h2>
    <button @click="notarize()">Notarize asset</button>
    <button @click="disclose()">Create asset evidence</button>
    <button @click="imprint()">Calculate imprint from asset proofs</button>
    <button @click="calculate()">Calculate imprint from asset evidence</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      exchangeId: '0x2c7daa2fc373d7bde4c20073782f3745d1475b50',
      orderData: {
        makerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
        takerId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
        seed: Date.now(),
        expiration: 1543876902000,
        actions: [
          {
            kind: 2, // transfer
            ledgerId: '0x5cc75608c940ea0c8750a0a8532c2ffa17fb8b91',
            senderId: '0x44e44897fc076bc46aae6b06b917d0dfd8b2dae9',
            receiverId: '0x85A9916425960aA35B2a527D77C71855DC0215B3',
            assetId: '1'
          },
        ],
      },
      assetSchema: {
        type: 'object',
        properties: {
          name: {
            type: 'string',
          },
          age: {
            type: 'integer',
          },
        },
      },
      assetData: {
        age: 38,
        name: 'John',
      }
    }
  },
  methods: {
    async connect() {
      await this.$0xcert.provider.enable()
      const isSupported = this.$0xcert.provider.isSupported()
      const isEnabled = await this.$0xcert.provider.isEnabled()
      console.log('Is metamask supported:', isSupported)
      console.log('Is metamask enabled:', isEnabled)
    },
    async claim() {
      const exchange = await this.$0xcert.getOrderGateway(this.exchangeId)
      const signature = await exchange.claim(this.orderData)
      console.log('Signed order claim:', signature)
    },
    async perform() {
      const exchange = await this.$0xcert.getOrderGateway(this.exchangeId)
      const signature = await exchange.claim(this.orderData)
      const mutation = await exchange.perform(this.orderData, signature)
      console.log('Performed order mutation:', mutation)
    },
    async cancel() {
      const exchange = await this.$0xcert.getOrderGateway(this.exchangeId)
      const mutation = await exchange.cancel(this.orderData)
      console.log('Canceled order mutation:', mutation)
    },
    async notarize() {
      const cert = this.$0xcert.createCert({ schema: this.assetSchema });
      const proofs = await cert.notarize(this.assetData);
      console.log('Notarized asset proofs:', JSON.stringify(proofs))
    },
    async disclose() {
      const paths = [['age']];
      const cert = this.$0xcert.createCert({ schema: this.assetSchema });
      const proofs = await cert.disclose(this.assetData, paths);
      console.log('Asset evidence:', JSON.stringify(proofs))
    },
    async imprint() {
      const paths = [['age']];
      const cert = this.$0xcert.createCert({ schema: this.assetSchema });
      const proofs = await cert.notarize(this.assetData);
      const imprint = await cert.calculate(this.assetData, proofs);
      console.log('Asset imprint from asset proofs:', imprint)
    },
    async calculate() {
      const cert = this.$0xcert.createCert({ schema: this.assetSchema });
      const proofs = await cert.disclose(this.assetData, [['age']]);
      const imprint = await cert.calculate({ age: 38 }, proofs);
      console.log('Asset imprint from evidence:', imprint)
    },
  }
}
</script>
