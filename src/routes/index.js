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

// GET /como-empanar
router.get('/como-empanar', (req, res) => {
    res.locals.setCacheHeaders()
    const { config } = res.locals.getData()
    const waMsg = encodeURIComponent('Olá! Vim da página de receitas, quero consultar disponibilidade dos peixes empanados.')
    const waUrl = 'https://wa.me/' + config.whatsapp + '?text=' + waMsg
    res.render('pages/como-empanar', {
        titulo: 'Como Empanar Filé de Peixe • violinha.com.br',
        waUrl,
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
