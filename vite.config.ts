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
/** Which fonts the first screen of each page sets, so they can start downloading with the HTML. */
const FONTS: Record<string, { en: string[]; ar: string[] }> = {
  mas: { en: ['archivo-latin-wght-normal'], ar: ['ibm-plex-sans-arabic-arabic-400-normal', 'ibm-plex-sans-arabic-arabic-600-normal'] },
  aroma: { en: ['fraunces-latin-wght-normal', 'caveat-latin-700-normal', 'dm-sans-latin-wght-normal'], ar: ['almarai-arabic-400-normal', 'almarai-arabic-700-normal'] },
  covy: { en: ['bodoni-moda-latin-wght-normal', 'bodoni-moda-latin-wght-italic', 'jost-latin-wght-normal'], ar: ['amiri-arabic-400-normal', 'ibm-plex-sans-arabic-arabic-400-normal'] },
}
/** The page module behind each route, and the lazy modules its first screen needs straight away. */
const ENTRY: Record<string, string[]> = {
  mas: ['pages/Home'],
  aroma: ['pages/AromaPage', 'three/Scene3D'],
  covy: ['pages/BrandPage'],
}

function staticPages(): Plugin {
  const fonts = new Map<string, string>()
  const chunkOf = new Map<string, string>()
  const importsOf = new Map<string, string[]>()
  const cssOf = new Map<string, string[]>()
  return {
    name: 'mas-static-pages',
    apply: 'build',
    writeBundle(_options, bundle) {
      for (const [file, item] of Object.entries(bundle)) {
        if (item.type === 'asset') {
          const m = /assets\/(.+)-[\w-]{8}\.woff2$/.exec(file)
          if (m) fonts.set(m[1], '/' + file)
        } else {
          importsOf.set(file, item.imports)
          cssOf.set(file, [...((item as { viteMetadata?: { importedCss?: Set<string> } }).viteMetadata?.importedCss ?? [])])
          for (const id of item.moduleIds) {
            const m = /src\/((?:pages|three)\/[\w]+|ar\.core|menu\.ar)\.tsx?$/.exec(id)
            if (m) chunkOf.set(m[1], file)
          }
        }
      }
    },
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
        const base = p.path.replace(/^\/ar(?=\/|$)/, '') || '/'
        const key = base.startsWith('/aroma') ? 'aroma' : base.startsWith('/covy') ? 'covy' : 'mas'
        const mods = new Set<string>()
        const walk = (f?: string) => {
          if (!f || mods.has(f)) return
          mods.add(f)
          for (const i of importsOf.get(f) ?? []) walk(i)
        }
        for (const e of ENTRY[key]) walk(chunkOf.get(e))
        if (p.lang === 'ar') {
          walk(chunkOf.get('ar.core'))
          if (key === 'aroma') walk(chunkOf.get('menu.ar'))
        }
        const preload = [
          ...FONTS[key][p.lang].map((f) => fonts.get(f)).filter(Boolean).map((href) => `<link rel="preload" as="font" type="font/woff2" crossorigin href="${href}" />`),
          ...[...new Set([...mods].flatMap((f) => cssOf.get(f) ?? []))].filter((f) => !template.includes(f)).map((f) => `<link rel="stylesheet" crossorigin href="/${f}" />`),
          ...[...mods].filter((f) => !template.includes(f)).map((f) => `<link rel="modulepreload" crossorigin href="/${f}" />`),
        ].join('\n    ')
        const html = template
          .replace('</head>', `  ${preload}\n  </head>`)
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
