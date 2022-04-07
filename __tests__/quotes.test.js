const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const pool = require('../lib/utils/pool');

const agent = request.agent(app);

jest.mock('../lib/utils/github.js');

describe('github quotes route', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('gets quotes', async () => {
    await agent.get('/api/v1/github/login/callback?code=42').redirects(1);

    const expected = [
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
      { author: expect.any(String), content: expect.any(String) },
    ];

    const res = await agent.get('/api/v1/quotes');

    expect(res.body).toEqual(expected);
  });
});
