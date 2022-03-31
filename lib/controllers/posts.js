const { Router } = require('express');
const authenticate = require('../middleware/authenticate');
const Post = require('../models/Post');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const post = await Post.insert({
      ...req.body,
      userId: req.user.userId,
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});
