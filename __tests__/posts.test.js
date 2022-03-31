const setup = require('../data/setup');
const app = require('../lib/app');
const request = require('../lib/app');
const GithubUser = require('../lib/models/GithubUser');
const pool = require('../lib/utils/pool');

jest.mock('../lib/middleware/authenticate.js', () => {
  return (req, res, next) => {
    req.user = {
      username: 'fake_github_user',
      email: 'not-real@example.com',
    };
    next();
  };
});

describe('github posts route', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creats a post', async () => {
    await GithubUser.insert({
      username: 'fake_github_user',
      email: 'not-real@example.com',
    });

    return request(app)
      .post('/api/v1/posts')
      .send({ text: 'This is a post' })
      .then((res) => {
        expect(res.body).toEqual({
          id: 1,
          text: 'This is a post',
          username: 'fake_github_user',
        });
      });
  });
});
