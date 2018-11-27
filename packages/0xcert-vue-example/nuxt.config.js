export default {
  build: {
    extend(config, { isDev }) {
      if (isDev) config.resolve.symlinks = false
    },
  },
  plugins: [
    { src: '~/plugins/0xcert', ssr: false },
  ],
}
