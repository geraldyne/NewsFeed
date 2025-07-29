// Schema de GraphQL - Define la estructura de nuestra API
export const schema = `
  # Tipo Author - Representa información del autor
  type Author {
    name: String!        # Nombre del autor
    username: String!    # Nombre de usuario
    avatar: String       # URL del avatar
  }

  # Tipo Post - Representa una publicación
  type Post {
    id: ID!              # ID único (obligatorio)
    title: String!       # Título (obligatorio)
    body: String!        # Contenido (obligatorio)
    author: Author!      # Información del autor (obligatorio)
    likesCount: Int!     # Número de likes (obligatorio)
    userLiked: Boolean!  # Si el usuario actual dio like
    createdAt: String!   # Fecha de creación (obligatorio)
    
    # Nuevos campos agregados
    views: Int!          # Número de vistas
    commentsCount: Int!  # Número de comentarios
    readTime: String!    # Tiempo de lectura estimado (ej: "3 min")
    tags: [String!]!     # Etiquetas/tags del post
    isBookmarked: Boolean! # Si está guardado en bookmarks
    trending: Boolean!   # Si es un post trending/popular
    timestamp: String!   # Timestamp relativo (ej: "hace 2 horas")
  }

  # Queries - Lo que puedes CONSULTAR
  type Query {
    # Obtener lista de posts con paginación
    posts(limit: Int, offset: Int): [Post!]!
    
    # Obtener un post específico por ID
    post(id: ID!): Post
    
    # Obtener estadísticas generales
    postsCount: Int!
  }

  # Mutations - Lo que puedes MODIFICAR
  type Mutation {
    # Crear un nuevo post
    createPost(
      title: String!
      body: String!
      authorName: String!
      authorUsername: String
      tags: [String!]
    ): Post!
    
    # Dar like a un post
    likePost(id: ID!): Post!
    
    # Quitar like de un post
    unlikePost(id: ID!): Post!
    
    # Incrementar vistas de un post
    incrementViews(id: ID!): Post!
    
    # Toggle bookmark de un post
    toggleBookmark(id: ID!): Post!
    
    # Eliminar un post
    deletePost(id: ID!): Boolean!
  }

  # Subscriptions - Para tiempo real (futuro)
  type Subscription {
    # Se dispara cuando se crea un nuevo post
    postCreated: Post!
    
    # Se dispara cuando un post recibe like
    postLiked(postId: ID!): Post!
  }
`;
