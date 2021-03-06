const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');

const agent = request.agent(app);
jest.mock('../lib/utils/github.js');

describe('github posts route', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a post', async () => {
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const res = await agent
      .post('/api/v1/posts')
      .send({ text: 'This is a post' });

    expect(res.body).toEqual({
      id: 1,
      text: 'This is a post',
      username: 'fake_github_user',
    });
  });

  it('tests that post length is limited to 255 chars', async () => {
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const res = await agent.post('/api/v1/posts').send({
      text: 'You’ve volunteered to help build a new project that your dev buddy thinks is going to be the next unicorn startup: you’re making a Twitter clone for developers. However, instead of using traditional usernames/passwords for authentication, your users will sign up and log in using their Github accounts. Your job is to build the authentication API, a protected endpoint (i.e. you must be signed in to access it) for creating text posts limited to 255 characters, and another protected endpoint for listing posts from all users.',
    });

    expect(res.body).toEqual({
      status: 500,
      message: 'value too long for type character varying(255)',
    });
  });

  it('returns a list of posts', async () => {
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const expected = [
      {
        id: 1,
        text: 'This is a post for the list of posts display',
        username: 'fake_github_user',
      },
      {
        id: 2,
        text: 'This is a post for the list of posts display',
        username: 'fake_github_user',
      },
      {
        id: 3,
        text: 'This is a post for the list of posts display',
        username: 'fake_github_user',
      },
      {
        id: 4,
        text: 'This is a post for the list of posts display',
        username: 'fake_github_user',
      },
      {
        id: 5,
        text: 'This is a post for the list of posts display',
        username: 'fake_github_user',
      },
    ];

    for (let i = 0; i < 5; i++) {
      await agent
        .post('/api/v1/posts')
        .send({ text: 'This is a post for the list of posts display' });
    }
    const res = await agent.get('/api/v1/posts');

    expect(res.body).toEqual(expected);
  });
});
