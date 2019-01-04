<template>
  <div class="logos"> 
    <ul>
      <li class="icon xcert"><a href="https://0xcert.org" target="_blank">0xcert.org</a></li>
      <li class="icon validator"><a href="https://erc721validator.org" target="_blank">erc721validator.org</a></li>
      <li class="icon swapmarket"><a href="https://swapmarket.com" target="_blank">swapmarket.com</a></li>
      <li class="icon alliance"><a href="https://nonfungiblealliance.org" target="_blank">nonfungiblealliance.org</a></li>
    </ul>
  </div>
</template>

<script>
  export default {
    
  }
</script>

<style lang="stylus" scoped>
.logos
  margin-top: auto
  margin-bottom: 2rem
  li
    margin-left: 1.5rem
    margin-bottom: 0.5rem
    a
      color: #2c3e50
      font-weight: 400
  .icon 
    padding-left: 35px
    background-repeat: no-repeat
  .xcert
    background-image: url('./assets/icon_0xcert.svg')
  .validator
    background-image: url('./assets/icon_validator.svg')
  .swapmarket
    background-image: url('./assets/icon_swapmarket.svg')
  .alliance
    background-image: url('./assets/icon_nfa.svg')

</style>