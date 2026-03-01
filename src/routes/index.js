'use strict'

const express = require('express')
const router = express.Router()

// GET /
router.get('/', (req, res) => {
    res.locals.setCacheHeaders()
    const { produtos } = res.locals.getData()
    // Home: exibe todos os produtos ativos. Ordena colocando os sem estoque no final.
    const cardsProdutos = produtos.filter(p => p.ativo).sort((a, b) => {
        if (a.em_estoque === b.em_estoque) return 0;
        return a.em_estoque ? -1 : 1;
    })
    res.render('pages/home', {
        titulo: 'violinha.com.br • Peixe para Páscoa em Novo Hamburgo',
        produtos: cardsProdutos,
    })
})

// GET /como-preparar
router.get('/como-preparar', (req, res) => {
    res.locals.setCacheHeaders()
    res.render('pages/como-preparar', {
        titulo: 'Como Preparar • violinha.com.br',
    })
})

// GET /tradicoes
router.get('/tradicoes', (req, res) => {
    res.locals.setCacheHeaders()
    res.render('pages/tradicoes', {
        titulo: 'Peixes de Escama e de Couro • Tradições da Páscoa',
    })
})

// GET /contato
router.get('/contato', (req, res) => {
    res.locals.setCacheHeaders()
    res.render('pages/contato', {
        titulo: 'Onde Estamos • violinha.com.br em Novo Hamburgo',
    })
})

module.exports = router
