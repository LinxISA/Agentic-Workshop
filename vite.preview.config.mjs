export default {
  plugins: [
    {
      name: 'summerschool-slidev-deep-link-fallback',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? '/', 'http://127.0.0.1')
          const match = url.pathname.match(/^\/(session-[12])(?:\/(?:[1-9]|1\d|2[0-8]))?\/?$/)
          if (match)
            request.url = `/${match[1]}/index.html${url.search}`
          next()
        })
      },
    },
  ],
}
