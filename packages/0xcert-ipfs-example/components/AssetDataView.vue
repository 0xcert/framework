<template>
  <div class="row">
    <div class="col">
      <h5>
        Asset Data
      </h5>
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="asset-data-name">Name</span>
          </div>
          <input type="text" class="form-control" placeholder="Name" aria-describedby="asset-data-id" v-model="assetData.name">
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="asset-data-description">Description</span>
          </div>
          <b-form-textarea type="text" class="form-control" placeholder="Description" aria-describedby="asset-data-description" v-model="assetData.description">
          </b-form-textarea>
        </div>
      </div>
      <div class="form-group">
        <div class="input-group">
          <div class="input-group-prepend">
            <span class="input-group-text" id="asset-data-image">Image</span>
          </div>
          <input type="text" class="form-control" placeholder="Image" aria-describedby="asset-data-image" v-model="assetData.image">
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "asset-data",
  props: {
    assetData: {
      name: {
        type: String,
        default: ""
      },
      description: {
        type: String,
        default: ""
      },
      image: {
        type: String,
        default: ""
      }
    }
  }
};
</script>
<style>
</style>
