import {
  getAllPosts,
  createPost,
  likePost,
  unlikePost,
  incrementViews,
  toggleBookmark,
  getPostById,
  getPostsCount,
} from "./database.js";

// Función helper para formatear timestamp relativo
const formatTimestamp = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

  if (diffInHours < 1) return "hace unos minutos";
  if (diffInHours === 1) return "hace 1 hora";
  if (diffInHours < 24) return `hace ${diffInHours} horas`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return "hace 1 día";
  return `hace ${diffInDays} días`;
};

// Resolvers - Funciones que obtienen los datos para cada campo del schema
export const resolvers = {
  // Transformar datos del post para incluir campos calculados
  Post: {
    author: (parent) => ({
      name: parent.authorName || parent.author || "Anonymous",
      username:
        parent.authorUsername ||
        (parent.author || "anonymous").toLowerCase().replace(/\s+/g, ""),
      avatar:
        parent.authorAvatar ||
        `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
          parent.authorName || parent.author || "Anonymous"
        )}`,
    }),
    tags: (parent) => {
      try {
        return JSON.parse(parent.tags || "[]");
      } catch {
        return [];
      }
    },
    timestamp: (parent) => formatTimestamp(parent.createdAt),
    trending: (parent) => Boolean(parent.trending),
    isBookmarked: (parent) => Boolean(parent.isBookmarked),
    userLiked: (parent) => Boolean(parent.userLiked),
  },

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
        const post = await getPostById(id);

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
        const count = await getPostsCount();
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
      const {
        title,
        body,
        authorName = "Anonymous",
        authorUsername,
        tags = [],
      } = args;

      console.log(`📝 Creating new post: "${title}" by ${authorName}`);

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
        const username =
          authorUsername || authorName.toLowerCase().replace(/\s+/g, "");
        const newPost = await createPost(
          title.trim(),
          body.trim(),
          authorName,
          username,
          tags
        );
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
          `✅ Post ${id} liked. New count: ${updatedPost.likesCount}`
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
          `✅ Post ${id} unliked. New count: ${updatedPost.likesCount}`
        );
        return updatedPost;
      } catch (error) {
        console.error("❌ Error unliking post:", error);
        throw new Error("Failed to unlike post");
      }
    },

    // Resolver para incrementar vistas
    incrementViews: async (parent, { id }) => {
      console.log(`👀 Incrementing views for post with ID: ${id}`);

      try {
        const updatedPost = await incrementViews(id);
        console.log(
          `✅ Post ${id} views incremented. New count: ${updatedPost.views}`
        );
        return updatedPost;
      } catch (error) {
        console.error("❌ Error incrementing views:", error);
        throw new Error("Failed to increment views");
      }
    },

    // Resolver para toggle bookmark
    toggleBookmark: async (parent, { id }) => {
      console.log(`🔖 Toggling bookmark for post with ID: ${id}`);

      try {
        const updatedPost = await toggleBookmark(id);
        console.log(
          `✅ Post ${id} bookmark toggled. Bookmarked: ${updatedPost.isBookmarked}`
        );
        return updatedPost;
      } catch (error) {
        console.error("❌ Error toggling bookmark:", error);
        throw new Error("Failed to toggle bookmark");
      }
    },

    // Resolver para eliminar un post
    deletePost: async (parent, { id }) => {
      console.log(`🗑️ Deleting post with ID: ${id}`);

      try {
        // Verificar que el post existe
        const post = await getPostById(id);
        if (!post) {
          throw new Error(`Post with ID ${id} not found`);
        }

        // En un sistema real, aquí habría una función deletePost en database.js
        console.log(`✅ Post ${id} would be deleted`);
        return true;
      } catch (error) {
        console.error("❌ Error deleting post:", error);
        throw new Error("Failed to delete post");
      }
    },
  },
};
