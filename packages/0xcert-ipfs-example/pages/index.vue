<template>
  <div id="app">
    <div class="row">
      <div class="col">
        <asset-ledger-view
          :assetLedgerInfo="assetLedgerInfo"
        />
        <h2>Asset Ledger</h2>
        <b-button @click="deployNewAssetLedger()">Deploy new asset ledger</b-button>
        <b-button @click="getAssetLedgerInfo()">Get asset ledger info</b-button>
      </div>
      <div class="col">
        <asset-data-view
          :assetData="assetData"
        />
        <h2>Asset Storage</h2>
        <div class="row">
          <div class="input-group col-md-3">
            <div class="input-group-prepend">
              <span class="input-group-text" id="asset-data-id">ID</span>
            </div>
            <input type="text" class="form-control" placeholder="ID" aria-describedby="asset-data-id" v-model="assetId">
          </div>
          <b-button @click="createNewAsset()">Create asset</b-button>
          <b-button @click="saveAssetId()">Save Asset</b-button>
          <b-button @click="loadAssetId()">Load asset</b-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { MetamaskProvider } from '@0xcert/ethereum-metamask-provider';
import { AssetLedger, AssetLedgerCapability } from '@0xcert/ethereum-asset-ledger';
import { Cert } from '@0xcert/cert';
import { schema88 } from '@0xcert/conventions';
// import { Storage } from '@0xcert/storage-ipfs';
import * as axios from 'axios';

import AssetDataView from '~/components/AssetDataView.vue'
import AssetLedgerView from '~/components/AssetLedgerView.vue'

const cert = new Cert({
    schema: schema88,
});

export default {
  components: {
    AssetDataView,
    AssetLedgerView
  },
  data() {
    return{
      provider: null,

      assetLedgerId: "0xC8Ca668c284c6Ed37357CD6F1caC12169E5391e1",
      assetLedgerInfo: {
        name: '',
        symbol: '',
        supply: 0,
        uriBase: '',
        schemaId: '',
        capabilities: [
          AssetLedgerCapability.TOGGLE_TRANSFERS,
        ],
      },

      assetId: '1',
      assetHash: 'QmVjfgKwssdn1pU2eVEaTVVNUNWYnLMDXYN2iKuecy79Do',
      assetData: {
        description: '',
        image: '',
        name: ''
      },
    }
  },
  async mounted() {
    this.provider = new MetamaskProvider();

    if (!await this.provider.isEnabled()) {
      await this.provider.enable();
    }

    this.getAssetLedgerInfo();
  },
  methods: {
    /**
     * Deploy a new ledger for this instance
     */
    async deployNewAssetLedger() {
      const mutation = await AssetLedger.deploy(this.provider, this.assetLedgerInfo).then((mutation) => {
          return mutation.complete();
      });

      this.assetLedgerId = mutation.receiverId;
      console.log(this.assetLedgerId);
    },

    /**
     * Ledger info
     */
    async getAssetLedgerInfo() {
      const assetLedger = AssetLedger.getInstance(this.provider, this.assetLedgerId);
      this.assetLedgerInfo = await assetLedger.getInfo();
    },

    /**
     * Create new asset on current leadger and saves the data to IPFS
     */
    async createNewAsset() {
      const imprint = await cert.imprint(this.assetData);
      console.log(imprint);
      console.log(this.assetId);

      const assetLedger = AssetLedger.getInstance(this.provider, this.assetLedgerId);
      const mutation = await assetLedger.createAsset({
        id: this.assetId,
        imprint: imprint,
        receiverId: this.provider.accountId,
      }).then((mutation) => {
          return mutation.complete();
      });
    },

    /**
     * Get asset info from the blockchain
     */
    async getAssetInfo() {
      const assetLedger = AssetLedger.getInstance(this.provider, this.assetLedgerId);
      const assetInfo = await assetLedger.getAssetInfo(this.assetId);
      console.log(assetInfo);
    },

    /**
     * Save asset to IPFS and store a key - value (ID - hash) reference to the database.
     */
    async saveAssetId() {
      axios.post('/storage/' + this.assetId, this.assetData)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    },

    /**
     * Load the data on IPFS cresponding to asset ID.
     */
    async loadAssetId() {
      axios.get('/storage/' + this.assetId)
      .then((response) => {
        this.assetData = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
    }
  }
}
</script>

<style>

body {
  max-width: 950px;
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

</style>
