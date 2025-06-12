import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/,'')
      },
    },
  },
})

// /api path setup for containers will trigger proxy, request will go to 'target' (our backend)'rewrite takes the /api prefix off the request
// when running locally vite dev server will intercept /api/session for example, remove /api and forward /session to local backend at localhost:5000
// running in container Nginx server will intercept and proxy_pass config (in nginx.conf) will forward /session to http://backend:5000

// path is incoming path request from frontend.
// replace: / .... / delimiters for regular expression (regex) in JS
// ^ is anchor, 'match beginning of the string'
// so /..../ delimits the regex
// ^ means look for this pattern
// the \ is to 'escape' use of the immediately following /, otherwise it would think its the end delimiter
// /api is what it's looking for
// reads as " / (open) ^ (look for) \ ('escape' to prevent closing) /api (pattern to find) / (close) "
// "" in second argument means replace with empty string - make sure empty string no spaces