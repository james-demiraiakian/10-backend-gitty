const { Router } = require('express');
const { exchangeCodeForToken } = require('../utils/github');

module.exports = Router()
  .get('/login', async (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })
  .get('/login/callback', async (req, res, next) => {
    try {
      const token = await exchangeCodeForToken(req.query.code);
      const profile = await getGithubProfile(token);

      let user = await GithubUser.findByUsername(profile.login);

      if (!user) {
        user = await GithubUser.insert({
          username: profile.login,
          email: profile.email,
          avatar: profile.avatar_url,
        });
      }

      res
        .cookie(process.env.COOKIE_NAME, sign(user), {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24,
        })
        .redirect('/api/v1/github/dashboard');
    } catch (error) {
      next(error);
    }
  });
