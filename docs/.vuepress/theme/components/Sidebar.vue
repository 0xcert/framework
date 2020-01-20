<template>
  <aside class="sidebar">
    <NavLinks/>
    <slot name="top"/>
    <SidebarLinks :depth="0" :items="items"/>
    <slot name="bottom"/>
    <div class="footer">
      <img src="/0xcert-framework.svg" alt="">
      <p>The 0xcert Framework is a platform that provides a complete set of tools for building powerful decentralized applications (dapps). <br/>Feel free to <a href="https://github.com/0xcert/framework/blob/master/CONTRIBUTING.md" target="_blank">contribute.</a></p>
    </div>
  </aside>
</template>

<script>
import SidebarLinks from '@theme/components/SidebarLinks.vue'
import NavLinks from '@theme/components/NavLinks.vue'

export default {
  name: 'Sidebar',
  components: { SidebarLinks, NavLinks },
  props: ['items']
}
</script>

<style lang="stylus">
.sidebar::-webkit-scrollbar-thumb
  border 2px solid #2b2b2b

.sidebar
  color #FFF

  .footer 
    text-align center
    border-top 1px solid rgba(255,255,255,0.2)
    padding 1.5rem 1.5rem 0
    font-size 12px
    color rgba(255,255,255,0.5)

    img 
      display block
      margin 0 auto;
      
  ul
    padding 0
    margin 0
    list-style-type none
  a
    display inline-block
  .nav-links
    display none
    border-bottom 1px solid $borderColor
    padding 0.5rem 0 0.75rem 0
    a
      font-weight 600
    .nav-item, .repo-link
      display block
      line-height 1.25rem
      font-size 1.1em
      padding 0.5rem 0 0.5rem 1.5rem
  & > .sidebar-links
    padding 1.5rem 0
    & > li > a.sidebar-link
      font-size 1.1em
      line-height 1.7
      font-weight bold
    & > li:not(:first-child)
      margin-top .75rem

@media (max-width: $MQMobile)
  .sidebar
    .nav-links
      display block
      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after
        top calc(1rem - 2px)
    & > .sidebar-links
      padding 1rem 0
</style>
