<template>
  <div class="row">
    <div class="col">
      <h5>
        Ledger Info
      </h5>
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="asset-ledger-info-name">Name</span>
          </div>
          <input
            type="text"
            class="form-control"
            placeholder="Name"
            aria-describedby="asset-ledger-info-name"
            v-model="assetLedgerInfo.name"
          >
        </div>
      </div>
      <div class="form-row">
        <div class="form-group col-md-6">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="asset-ledger-info-symbol">Symbol</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Symbol"
              aria-describedby="asset-ledger-info-symbol"
              v-model="assetLedgerInfo.symbol"
            >
          </div>
        </div>
        <div class="form-group col-md-6">
          <div class="input-group">
            <div class="input-group-prepend">
              <span class="input-group-text" id="asset-ledger-info-supply">Supply</span>
            </div>
            <input
              type="text"
              class="form-control"
              placeholder="Supply"
              aria-describedby="asset-ledger-info-supply"
              v-model="assetLedgerInfo.supply"
              disabled
            >
          </div>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="asset-ledger-info-uri">Base URI</span>
          </div>
          <input
            type="text"
            class="form-control"
            placeholder="URI"
            aria-describedby="asset-ledger-info-uri"
            v-model="assetLedgerInfo.uriBase"
          >
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="asset-ledger-schema-info-id">Schema ID</span>
          </div>
          <input
            type="text"
            class="form-control"
            placeholder="Schema ID"
            aria-describedby="asset-ledger-schema-info-id"
            v-model="assetLedgerInfo.schemaId"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "asset-ledger",
  props: {
    assetLedgerInfo: {
      name: {
        type: String,
        default: ""
      },
      symbol: {
        type: String,
        default: ""
      },
      supply: {
        type: Number,
        default: 0
      },
      uriBase: {
        type: String,
        default: ""
      },
      schemaId: {
        type: String,
        default: ""
      }
    }
  }
};
</script>
<style>
</style>
