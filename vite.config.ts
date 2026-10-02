import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { PAGES, jsonLd } from './src/seo.ts'

/**
 * Link previews on WhatsApp, Instagram and Facebook never run JavaScript, so
 * each page gets its own copy of index.html with its title, description,
 * share image and structured data already in the head. Hosts serve
 * /aroma/index.html for /aroma before falling back to the single-page app.
 */
function staticPages(): Plugin {
  return {
    name: 'mas-static-pages',
    apply: 'build',
    closeBundle() {
      const dist = join(process.cwd(), 'dist')
      const site = (
        process.env.SITE_URL ||
        process.env.URL ||
        (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '')
      ).replace(/\/$/, '')
      const template = readFileSync(join(dist, 'index.html'), 'utf8')
      const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
      for (const p of PAGES) {
        const abs = (u: string) => (site ? site + u : u)
        const head = [
          `<title>${esc(p.title)}</title>`,
          `<meta name="description" content="${esc(p.description)}" />`,
          `<meta property="og:type" content="website" />`,
          `<meta property="og:title" content="${esc(p.title)}" />`,
          `<meta property="og:description" content="${esc(p.description)}" />`,
          `<meta property="og:image" content="${abs(p.image)}" />`,
          `<meta property="og:image:width" content="1200" />`,
          `<meta property="og:image:height" content="630" />`,
          `<meta property="og:url" content="${abs(p.path)}" />`,
          `<meta property="og:locale" content="${p.lang === 'ar' ? 'ar_EG' : 'en_US'}" />`,
          `<meta name="twitter:card" content="summary_large_image" />`,
          site ? `<link rel="canonical" href="${abs(p.path)}" />` : '',
          site ? `<link rel="alternate" hreflang="${p.lang}" href="${abs(p.path)}" />` : '',
          site ? `<link rel="alternate" hreflang="${p.lang === 'ar' ? 'en' : 'ar'}" href="${abs(p.alternate)}" />` : '',
          `<script type="application/ld+json" id="ld-json">${JSON.stringify(jsonLd(p, site))}</script>`,
        ].filter(Boolean).join('\n    ')
        const html = template
          .replace(/<title>.*?<\/title>/s, head)
          .replace(/<html lang="[^"]*"/, `<html lang="${p.lang}" dir="${p.lang === 'ar' ? 'rtl' : 'ltr'}"`)
          .replace(/<meta name="theme-color" content="[^"]*"/, `<meta name="theme-color" content="${p.themeColor}"`)
          .replace(/<link rel="icon"[^>]*>/, `<link rel="icon" href="${p.icon}" />`)
        const out = p.path === '/' ? dist : join(dist, p.path)
        mkdirSync(out, { recursive: true })
        writeFileSync(join(out, 'index.html'), html)
      }
      if (site) {
        const urls = PAGES.map((p) => `  <url><loc>${site}${p.path}</loc></url>`).join('\n')
        writeFileSync(join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`)
        writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${site}/sitemap.xml\n`)
      } else {
        writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n`)
      }
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), staticPages()],
  build: { chunkSizeWarningLimit: 700 },
})
