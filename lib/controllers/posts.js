const { Router } = require('express');
const authenticate = require('../middleware/authenticate');

module.exports = Router().post('/', authenticate, async (req, res, next) => {
  try {
    const post = await this.post.insert({
      ...req.body,
      userId: req.user.userId,
    });
    res.send(post);
  } catch (error) {
    next(error);
  }
});
