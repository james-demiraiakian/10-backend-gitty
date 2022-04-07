const fetch = require('cross-fetch');

const exchangeCodeForToken = (code) => {
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
    }),
  })
    .then((resp) => resp.json())
    .then((access_token) => access_token);
};

const getGithubProfile = (token) => {
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`,
    },
  })
    .then((resp) => resp.json())
    .then(({ avatar_url, login, email }) => {
      return { avatar_url, login, email };
    });
};

module.exports = { exchangeCodeForToken, getGithubProfile };
