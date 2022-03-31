const pool = require('../utils/pool');

module.exports = class Post {
  id;
  text;
  userId;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.userId = row.user_id;
  }

  static async insert({ text, userId }) {
    const { rows } = await pool.wuery(
      `
          INSERT INTO posts (text, user_id) 
          VALUES ($1, $2) 
          RETURNING *
      `,
      [text, userId]
    );

    return new Post(rows[0]);
  }
};
