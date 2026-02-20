'use strict'

require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 3008
const isProd = process.env.NODE_ENV === 'production' || process.env.NODE_ENV !== 'development'

// Garante que o BASE_URL nunca seja undefined.
// Se não especificado no .env, assume violinha.com.br (prod) ou localhost (dev).
const BASE_URL = process.env.BASE_URL

// ─── View Engine ─────────────────────────────────────────────────────────────
app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))
app.set('layout', 'layout') // renderiza sobre /src/views/layout.ejs
app.set('layout extractScripts', true)
app.set('layout extractMeta', true)

// ─── Assets estáticos ────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')))

// ─── Cache helper ────────────────────────────────────────────────────────────
// 1h fresco + 1h stale-while-revalidate — ver specs.md RNF01
const setCacheHeaders = (res) => {
    if (isProd) {
        res.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=3600')
    } else {
        res.set('Cache-Control', 'no-store')
    }
}

// ─── Dados ───────────────────────────────────────────────────────────────────
const dataPath = path.join(__dirname, 'data/data.json')
const getData = () => JSON.parse(fs.readFileSync(dataPath, 'utf-8'))

// ─── Helpers ──────────────────────────────────────────────────────────────────
const formatters = require('./src/helpers/formatters')

// ─── Rotas ───────────────────────────────────────────────────────────────────
const indexRouter = require('./src/routes/index')
const produtoRouter = require('./src/routes/produto')
const sitemapRouter = require('./src/routes/sitemap')

app.use((req, res, next) => {
    res.locals.BASE_URL = BASE_URL
    res.locals.current_path = req.path === '/' ? '' : req.path
    res.locals.getData = getData
    res.locals.formatters = formatters
    res.locals.setCacheHeaders = () => setCacheHeaders(res)
    next()
})

app.use('/', indexRouter)
app.use('/peixe', produtoRouter)
app.use('/', sitemapRouter)

// ─── 404 ─────────────────────────────────────────────────────────────────────
app.use((req, res) => {
    res.status(404).render('pages/404', { titulo: 'Página não encontrada', BASE_URL })
})

// ─── Start ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`🐟 Violinha rodando em http://127.0.0.1:3008`)
})
