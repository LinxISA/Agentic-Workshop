export default {
  plugins: [
    {
      name: 'summerschool-slidev-deep-link-fallback',
      configurePreviewServer(server) {
        server.middlewares.use((request, _response, next) => {
          const url = new URL(request.url ?? '/', 'http://127.0.0.1')
          const match = url.pathname.match(/^\/(session-[12])(?:\/(\d+))?\/?$/)
          const slideCounts = { 'session-1': 33, 'session-2': 31 }
          const requestedSlide = match?.[2] ? Number(match[2]) : null
          if (match && (requestedSlide === null || (requestedSlide >= 1 && requestedSlide <= slideCounts[match[1]])))
            request.url = `/${match[1]}/index.html${url.search}`
          next()
        })
      },
    },
  ],
}
