import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

const DOG_CASE_STUDY_PATH = '/case-studies/dog-adoption-volunteer-system'

/**
 * Vite's SPA fallback handles extensionless directory requests before looking
 * for index.html inside public/. Keep the clean production URL while making
 * the same route usable during `vite` QA.
 */
function caseStudyDirectoryIndex() {
  const rewrite = (req, _res, next) => {
    const [pathname, query] = (req.url ?? '').split('?')

    if (pathname === DOG_CASE_STUDY_PATH || pathname === `${DOG_CASE_STUDY_PATH}/`) {
      req.url = `${DOG_CASE_STUDY_PATH}/index.html${query ? `?${query}` : ''}`
    }

    next()
  }

  return {
    name: 'case-study-directory-index',
    configureServer(server) {
      server.middlewares.use(rewrite)
    },
  }
}


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig(({ command }) => ({
  // GitHub Pages publishes this repository below /portfolio/, while Vercel
  // serves the same build from the domain root and exposes VERCEL=1 at build
  // time. Consumed via import.meta.env.BASE_URL in src/lib/publicUrl.ts.
  base: command === 'build' && process.env.VERCEL !== '1' ? '/portfolio/' : '/',
  plugins: [
    caseStudyDirectoryIndex(),
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
}))
