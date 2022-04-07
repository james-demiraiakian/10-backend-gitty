const pool = require('../utils/pool');

module.exports = class GithubUser {
  id;
  username;
  email;
  avatar;

  constructor(row) {
    this.id = row.id;
    this.username = row.username;
    this.email = row.email;
    this.avatar = row.avatar;
  }

  static findByUsername(username) {
    pool
      .query(
        `
        SELECT 
            * 
        FROM 
            github_users 
        WHERE 
            username=$1
      `,
        [username]
      )
      .then((rows) => (!rows[0] ? null : new GithubUser(rows[0])));
  }

  static insert({ username, email, avatar }) {
    return pool
      .query(
        `
      INSERT INTO github_users (username, email, avatar) 
      VALUES ($1, $2, $3) 
      RETURNING *
      `,
        [username, email, avatar]
      )
      .then(({ rows }) => new GithubUser(rows[0]))
      .catch((error) => error);
  }

  toJSON() {
    return { ...this };
  }
};
