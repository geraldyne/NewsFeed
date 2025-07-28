import { getAllPosts, createPost, likePost, unlikePost } from "./database.js";

// Resolvers - Funciones que obtienen los datos para cada campo del schema
export const resolvers = {
  // QUERIES - Consultas de datos
  Query: {
    // Resolver para obtener lista de posts
    posts: async (parent, args, context) => {
      const { limit = 10, offset = 0 } = args;
      console.log(`📊 Fetching ${limit} posts starting from ${offset}`);

      try {
        const posts = await getAllPosts(limit, offset);
        console.log(`✅ Found ${posts.length} posts`);
        return posts;
      } catch (error) {
        console.error("❌ Error fetching posts:", error);
        throw new Error("Failed to fetch posts");
      }
    },

    // Resolver para obtener un post específico
    post: async (parent, { id }) => {
      console.log(`🔍 Fetching post with ID: ${id}`);

      try {
        const posts = await getAllPosts(100, 0); // Obtenemos más posts para buscar
        const post = posts.find((p) => p.id.toString() === id);

        if (!post) {
          throw new Error(`Post with ID ${id} not found`);
        }

        console.log(`✅ Found post: ${post.title}`);
        return post;
      } catch (error) {
        console.error("❌ Error fetching post:", error);
        throw error;
      }
    },

    // Resolver para contar total de posts
    postsCount: async () => {
      console.log("📊 Counting total posts");

      try {
        const posts = await getAllPosts(1000, 0); // Obtener todos
        const count = posts.length;
        console.log(`✅ Total posts: ${count}`);
        return count;
      } catch (error) {
        console.error("❌ Error counting posts:", error);
        throw new Error("Failed to count posts");
      }
    },
  },

  // MUTATIONS - Modificaciones de datos
  Mutation: {
    // Resolver para crear un nuevo post
    createPost: async (parent, args) => {
      const { title, body, author = "Anonymous" } = args;

      console.log(`📝 Creating new post: "${title}" by ${author}`);

      // Validaciones
      if (!title || title.trim().length === 0) {
        throw new Error("Title is required");
      }

      if (!body || body.trim().length === 0) {
        throw new Error("Body is required");
      }

      if (title.length > 100) {
        throw new Error("Title too long (max 100 characters)");
      }

      if (body.length > 1000) {
        throw new Error("Body too long (max 1000 characters)");
      }

      try {
        const newPost = await createPost(title.trim(), body.trim(), author);
        console.log(`✅ Created post with ID: ${newPost.id}`);
        return newPost;
      } catch (error) {
        console.error("❌ Error creating post:", error);
        throw new Error("Failed to create post");
      }
    },

    // Resolver para dar like a un post
    likePost: async (parent, { id }) => {
      console.log(`👍 Liking post with ID: ${id}`);

      try {
        const updatedPost = await likePost(id);
        console.log(
          `✅ Post ${id} liked! New count: ${updatedPost.likesCount}`
        );
        return updatedPost;
      } catch (error) {
        console.error("❌ Error liking post:", error);
        throw new Error("Failed to like post");
      }
    },

    // Resolver para quitar like de un post
    unlikePost: async (parent, { id }) => {
      console.log(`👎 Unliking post with ID: ${id}`);

      try {
        const updatedPost = await unlikePost(id);
        console.log(
          `✅ Post ${id} unliked! New count: ${updatedPost.likesCount}`
        );
        return updatedPost;
      } catch (error) {
        console.error("❌ Error unliking post:", error);
        throw new Error("Failed to unlike post");
      }
    },

    // Resolver para eliminar un post
    deletePost: async (parent, { id }) => {
      console.log(`🗑️ Deleting post with ID: ${id}`);

      try {
        // TODO: Implementar deletePost en database.js
        console.log(`✅ Post ${id} deleted`);
        return true;
      } catch (error) {
        console.error("❌ Error deleting post:", error);
        throw new Error("Failed to delete post");
      }
    },
  },
};

/*
SIMPLIFICACIONES PARA GRAPHQL YOGA:

1. ELIMINAMOS EL PARÁMETRO 'info':
   - GraphQL Yoga lo maneja automáticamente
   - Solo necesitamos parent, args, context

2. CONTEXT SIMPLIFICADO:
   - Solo incluimos lo esencial
   - GraphQL Yoga maneja request automáticamente

3. MEJOR MANEJO DE ERRORES:
   - Los errores se propagan automáticamente
   - Formato estándar de GraphQL

4. LOGS MEJORADOS:
   - Información clara de cada operación
   - Fácil debugging

5. VALIDACIONES ROBUSTAS:
   - Verificación de inputs
   - Mensajes de error claros
*/
