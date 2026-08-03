import { defineConfig } from 'vite'

const slidevDirectories = new Set(['/session-1', '/session-2'])

export default defineConfig({
  plugins: [{
    name: 'normalize-slidev-directory-urls',
    configurePreviewServer(server) {
      server.middlewares.use((request, response, next) => {
        const url = new URL(request.url || '/', 'http://preview.local')
        if (!slidevDirectories.has(url.pathname)) return next()

        response.statusCode = 308
        response.setHeader('Location', `${url.pathname}/${url.search}`)
        response.end()
      })
    },
  }],
})
