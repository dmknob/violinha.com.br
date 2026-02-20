'use strict'

const express = require('express')
const router = express.Router()

// GET /peixe/:slug
router.get('/:slug', (req, res) => {
    const { produtos } = res.locals.getData()
    const produto = produtos.find(p => p.slug === req.params.slug)

    // Produto não existe no JSON → 404
    if (!produto) {
        return res.status(404).render('pages/404', {
            titulo: 'Produto não encontrado',
            BASE_URL: res.locals.BASE_URL,
        })
    }

    // Produto existe mas ativo:false → página genérica de indisponível
    if (!produto.ativo) {
        return res.status(410).render('pages/produto-indisponivel', {
            titulo: `${produto.nome} • Indisponível`,
            produto,
        })
    }

    // Produto ativo (pode ou não ter estoque) → página completa
    res.locals.setCacheHeaders()
    res.render('pages/produto', {
        titulo: `${produto.nome} • violinha.com.br — Novo Hamburgo`,
        produto,
        BASE_URL: res.locals.BASE_URL,
        canonical_url: `${res.locals.BASE_URL}/peixe/${produto.slug}`
    })
})

module.exports = router
