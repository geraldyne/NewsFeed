// Schema de GraphQL - Define la estructura de nuestra API
export const schema = `
  # Tipo Post - Representa una publicación
  type Post {
    id: ID!              # ID único (obligatorio)
    title: String!       # Título (obligatorio)
    body: String!        # Contenido (obligatorio)
    author: String!      # Autor (obligatorio)
    likesCount: Int!     # Número de likes (obligatorio)
    userLiked: Boolean!  # Si el usuario actual dio like
    createdAt: String!   # Fecha de creación (obligatorio)
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
      author: String
    ): Post!
    
    # Dar like a un post
    likePost(id: ID!): Post!
    
    # Quitar like de un post
    unlikePost(id: ID!): Post!
    
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
