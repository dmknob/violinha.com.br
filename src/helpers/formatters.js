'use strict'

/**
 * Formata valor numérico para Moeda Brasileira (R$)
 * @param {number} value
 * @returns {string} Valor formatado (Ex: R$ 50,00)
 */
const formatCurrency = (value) => {
    if (value === undefined || value === null) return ''
    return Number(value).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    })
}

/**
 * Formata Data para Padrão Brasileiro (DD/MM/AAAA)
 * @param {string|Date} date
 * @returns {string} Data formatada (Ex: 03/04/2026)
 */
const formatDate = (date) => {
    if (!date) return ''

    // Tratar string YYYY-MM-DD para evitar problema de timezone
    const [year, month, day] = date.split('-')
    if (year && month && day) {
        return `${day}/${month}/${year}`
    }

    return new Date(date).toLocaleDateString('pt-BR')
}

module.exports = {
    formatCurrency,
    formatDate,
}
