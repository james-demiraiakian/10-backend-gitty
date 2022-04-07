const { Router } = require('express');
const { findByUsername } = require('../models/GithubUser');
const GithubUser = require('../models/GithubUser');
const { exchangeCodeForToken, getGithubProfile } = require('../utils/github');
const jwt = require('jsonwebtoken');

module.exports = Router()
  .get('/login', (req, res) => {
    res.redirect(
      `https://github.com/login/oauth/authorize?client_id=${process.env.CLIENT_ID}&scope=user&redirect_uri=http://localhost:7890/api/v1/github/login/callback`
    );
  })
  .get('/login/callback', (req, res, next) => {
    let current = {};
    exchangeCodeForToken(req.query.code)
      .then((token) => getGithubProfile(token))
      .then((profile) => {
        current = profile;
        return findByUsername(profile.login);
      })
      .then((user) => {
        if (!user) {
          return GithubUser.insert({
            username: current.login,
            email: current.email,
            avatar: current.avatar_url,
          });
        } else {
          return user;
        }
      })
      .then((payload) =>
        jwt.sign({ ...payload }, process.env.JWT_SECRET, {
          expiresIn: '1 day',
        })
      )
      .then((user) =>
        res
          .cookie(process.env.COOKIE_NAME, user, {
            httpOnly: true,
            maxAge: 1000 * 60 * 60 * 24,
          })
          .redirect('/api/v1/posts')
      )
      .catch((error) => next(error));
  })
  .delete('/sessions', (req, res) => {
    res
      .clearCookie(process.env.COOKIE_NAME)
      .json({ success: true, message: 'Signed out successfully!' });
  });
