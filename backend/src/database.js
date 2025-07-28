import sqlite3 from 'sqlite3';
import { promisify } from 'util';

// Crear conexión a la base de datos
const db = new sqlite3.Database('./posts.db');

// Convertir métodos a Promises para usar async/await
db.run = promisify(db.run);
db.get = promisify(db.get);
db.all = promisify(db.all);

// Crear tabla de posts si no existe
const initDatabase = async () => {
  await db.run(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      body TEXT NOT NULL,
      author TEXT DEFAULT 'Anonymous',
      likesCount INTEGER DEFAULT 0,
      userLiked BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insertar datos de ejemplo si la tabla está vacía
  const count = await db.get('SELECT COUNT(*) as count FROM posts');
  if (count.count === 0) {
    const samplePosts = [
      {
        title: 'Welcome to NewsFeed!',
        body: 'This is your first post. Start sharing your thoughts with the world!',
        author: 'NewsFeed Team',
        likesCount: 5
      },
      {
        title: 'Learning GraphQL',
        body: 'GraphQL is amazing! You can query exactly the data you need.',
        author: 'Developer',
        likesCount: 12
      },
      {
        title: 'React + Fastify',
        body: 'Building modern web apps with React frontend and Fastify backend.',
        author: 'Full Stack Dev',
        likesCount: 8
      }
    ];

    for (const post of samplePosts) {
      await db.run(
        'INSERT INTO posts (title, body, author, likesCount) VALUES (?, ?, ?, ?)',
        [post.title, post.body, post.author, post.likesCount]
      );
    }
    console.log('✅ Sample posts inserted');
  }
};

// Funciones para interactuar con la base de datos
export const getAllPosts = async (limit = 10, offset = 0) => {
  return await db.all(
    'SELECT * FROM posts ORDER BY createdAt DESC LIMIT ? OFFSET ?',
    [limit, offset]
  );
};

export const createPost = async (title, body, author = 'Anonymous') => {
  const result = await db.run(
    'INSERT INTO posts (title, body, author) VALUES (?, ?, ?)',
    [title, body, author]
  );
  
  return await db.get('SELECT * FROM posts WHERE id = ?', [result.lastID]);
};

export const likePost = async (id) => {
  await db.run(
    'UPDATE posts SET likesCount = likesCount + 1, userLiked = 1 WHERE id = ?',
    [id]
  );
  
  return await db.get('SELECT * FROM posts WHERE id = ?', [id]);
};

export const unlikePost = async (id) => {
  await db.run(
    'UPDATE posts SET likesCount = likesCount - 1, userLiked = 0 WHERE id = ?',
    [id]
  );
  
  return await db.get('SELECT * FROM posts WHERE id = ?', [id]);
};

// Inicializar base de datos
export default initDatabase;
