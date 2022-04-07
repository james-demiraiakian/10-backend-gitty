const fetch = require('cross-fetch');

const getQuotes = async () => {
  //   const quoteArr = [];

  return Promise.all([
    fetch('https://programming-quotes-api.herokuapp.com/quotes/random'),
    fetch('https://quotes.rest/qod?language=en'),
    fetch('https://api.quotable.io/random'),
  ])
    .then((arr) => Promise.all(arr.map((res) => res.json())))
    .then((arr) =>
      arr.map((elem) => {
        if (elem.success) {
          return {
            author: elem.contents.quotes[0].author,
            content: elem.contents.quotes[0].quote,
          };
        } else if (elem.en) {
          return {
            author: elem.author,
            content: elem.en,
          };
        } else if (elem.content) {
          return {
            author: elem.author,
            content: elem.content,
          };
        } else {
          return { author: 'null', content: 'Rate limited by api' };
        }
      })
    );
};

module.exports = getQuotes;
