const pool = require('../utils/pool');

module.exports = class Post {
  id;
  text;
  userId;

  constructor(row) {
    this.id = row.id;
    this.text = row.text;
    this.username = row.username;
  }

  static async insert({ text, username }) {
    const { rows } = await pool.query(
      `
          INSERT INTO posts (text, username) 
          VALUES ($1, $2) 
          RETURNING *
          `,
      [text, username]
    );

    return new Post(rows[0]);
  }

  static async getAll() {
    const { rows } = await pool.query('SELECT * FROM posts');

    return rows.map((row) => new Post(row));
  }
};
