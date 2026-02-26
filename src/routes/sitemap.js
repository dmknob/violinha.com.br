'use strict'

const express = require('express')
const router = express.Router()

// GET /sitemap.xml
router.get('/sitemap.xml', (req, res) => {
    const BASE_URL = 'https://violinha.com.br'
    const { produtos } = res.locals.getData()

    const rotas_estaticas = [
        { url: '/', prioridade: '1.0', frequencia: 'daily' },
        { url: '/como-preparar', prioridade: '0.8', frequencia: 'yearly' },
        { url: '/tradicoes', prioridade: '0.7', frequencia: 'yearly' },
        { url: '/contato', prioridade: '0.6', frequencia: 'monthly' },
    ]

    // Inclui produtos ativos (mesmo sem estoque — página existe para SEO)
    const rotas_produtos = produtos
        .filter(p => p.ativo)
        .map(p => ({
            url: `/peixe/${p.slug}`,
            prioridade: p.em_estoque ? '0.9' : '0.6',
            frequencia: 'daily',
        }))

    const todas = [...rotas_estaticas, ...rotas_produtos]
    console.log(todas);

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${todas.map(r => `  <url>
    <loc>${BASE_URL}${r.url}</loc>
    <changefreq>${r.frequencia}</changefreq>
    <priority>${r.prioridade}</priority>
  </url>`).join('\n')}
</urlset>`

    res.set('Content-Type', 'application/xml')
    //res.set('Cache-Control', 'public, max-age=86400')
    res.send(xml)
})

module.exports = router
