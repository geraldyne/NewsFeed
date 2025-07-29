import sqlite3 from "sqlite3";
import { promisify } from "util";

// Crear conexión a la base de datos
const db = new sqlite3.Database("./posts.db");

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
      authorName TEXT DEFAULT 'Anonymous',
      authorUsername TEXT DEFAULT 'anonymous',
      authorAvatar TEXT,
      likesCount INTEGER DEFAULT 0,
      userLiked BOOLEAN DEFAULT 0,
      views INTEGER DEFAULT 0,
      commentsCount INTEGER DEFAULT 0,
      readTime TEXT DEFAULT '1 min',
      tags TEXT DEFAULT '[]',
      isBookmarked BOOLEAN DEFAULT 0,
      trending BOOLEAN DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Insertar datos de ejemplo si la tabla está vacía
  const count = await db.get("SELECT COUNT(*) as count FROM posts");
  if (count.count === 0) {
    const samplePosts = [
      {
        title: "Welcome to NewsFeed!",
        body: "This is your first post. Start sharing your thoughts with the world! Explore all the amazing features we have built for you.",
        authorName: "NewsFeed Team",
        authorUsername: "newsfeed",
        authorAvatar:
          "https://api.dicebear.com/7.x/initials/svg?seed=NewsFeed%20Team",
        likesCount: 25,
        views: 156,
        commentsCount: 8,
        readTime: "2 min",
        tags: '["welcome", "newsfeed"]',
        trending: 1,
      },
      {
        title: "Learning GraphQL",
        body: "GraphQL is amazing! You can query exactly the data you need. This revolutionary approach to API design has changed how we think about data fetching.",
        authorName: "Developer",
        authorUsername: "developer",
        authorAvatar:
          "https://api.dicebear.com/7.x/initials/svg?seed=Developer",
        likesCount: 42,
        views: 289,
        commentsCount: 15,
        readTime: "4 min",
        tags: '["graphql", "api", "development"]',
        trending: 1,
      },
      {
        title: "React + Fastify",
        body: "Building modern web apps with React frontend and Fastify backend. The perfect combination for high-performance applications.",
        authorName: "Full Stack Dev",
        authorUsername: "fullstackdev",
        authorAvatar:
          "https://api.dicebear.com/7.x/initials/svg?seed=Full%20Stack%20Dev",
        likesCount: 18,
        views: 134,
        commentsCount: 6,
        readTime: "3 min",
        tags: '["react", "fastify", "fullstack"]',
        trending: 0,
      },
    ];

    for (const post of samplePosts) {
      await db.run(
        `INSERT INTO posts (title, body, authorName, authorUsername, authorAvatar, likesCount, views, commentsCount, readTime, tags, trending) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          post.title,
          post.body,
          post.authorName,
          post.authorUsername,
          post.authorAvatar,
          post.likesCount,
          post.views,
          post.commentsCount,
          post.readTime,
          post.tags,
          post.trending,
        ]
      );
    }
    console.log("✅ Sample posts inserted with full metadata");
  }
};

// Funciones para interactuar con la base de datos
export const getAllPosts = async (limit = 10, offset = 0) => {
  return await db.all(
    "SELECT * FROM posts ORDER BY createdAt DESC LIMIT ? OFFSET ?",
    [limit, offset]
  );
};

export const createPost = async (
  title,
  body,
  authorName = "Anonymous",
  authorUsername = "anonymous",
  tags = []
) => {
  // Calcular tiempo de lectura estimado
  const wordsPerMinute = 200;
  const wordCount = body.split(" ").length;
  const readTime = Math.ceil(wordCount / wordsPerMinute) + " min";

  // Generar avatar URL
  const authorAvatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
    authorName
  )}`;

  // Determinar si es trending (posts con mucho contenido o palabras clave)
  const trending =
    body.length > 200 ||
    tags.some((tag) =>
      ["trending", "popular", "news"].includes(tag.toLowerCase())
    );

  const result = await db.run(
    `INSERT INTO posts (title, body, authorName, authorUsername, authorAvatar, readTime, tags, trending, commentsCount) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      body,
      authorName,
      authorUsername,
      authorAvatar,
      readTime,
      JSON.stringify(tags),
      trending ? 1 : 0,
      Math.floor(Math.random() * 10),
    ]
  );

  return await db.get("SELECT * FROM posts WHERE id = ?", [result.lastID]);
};

export const likePost = async (id) => {
  await db.run(
    "UPDATE posts SET likesCount = likesCount + 1, userLiked = 1 WHERE id = ?",
    [id]
  );

  return await db.get("SELECT * FROM posts WHERE id = ?", [id]);
};

export const unlikePost = async (id) => {
  await db.run(
    "UPDATE posts SET likesCount = likesCount - 1, userLiked = 0 WHERE id = ?",
    [id]
  );

  return await db.get("SELECT * FROM posts WHERE id = ?", [id]);
};

// Incrementar vistas de un post
export const incrementViews = async (id) => {
  await db.run("UPDATE posts SET views = views + 1 WHERE id = ?", [id]);

  return await db.get("SELECT * FROM posts WHERE id = ?", [id]);
};

// Toggle bookmark de un post
export const toggleBookmark = async (id) => {
  await db.run(
    "UPDATE posts SET isBookmarked = NOT isBookmarked WHERE id = ?",
    [id]
  );

  return await db.get("SELECT * FROM posts WHERE id = ?", [id]);
};

// Obtener un post por ID
export const getPostById = async (id) => {
  return await db.get("SELECT * FROM posts WHERE id = ?", [id]);
};

// Obtener conteo total de posts
export const getPostsCount = async () => {
  const result = await db.get("SELECT COUNT(*) as count FROM posts");
  return result.count;
};

// Inicializar base de datos
export default initDatabase;
