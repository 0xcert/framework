export default {
  build: {
    extend(config, { isDev }) {
      if (isDev) config.resolve.symlinks = false
    },
  },
  plugins: [
    { src: '~/plugins/vue-0xcert', ssr: false },
  ],

}
