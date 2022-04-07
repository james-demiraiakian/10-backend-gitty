const { Router } = require('express');
const quotes = require('../services/quotes');

module.exports = Router().get('/', (req, res) => {
  quotes
    .getQuotes()
    .then((quote) => res.send(quote))
    .catch((error) => error);
});
