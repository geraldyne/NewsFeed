import { useQuery, useMutation } from "@apollo/client";
import { GET_POSTS, LIKE_POST } from "./apollo/queries.js";

import Post from "./components/PostCard";
import PostForm from "./components/PostForm";

function App() {
  // Apollo GraphQL query para obtener posts
  const {
    data: graphqlData,
    loading: graphqlLoading,
    error: graphqlError,
    refetch,
  } = useQuery(GET_POSTS, {
    errorPolicy: "all",
    notifyOnNetworkStatusChange: true,
    pollInterval: 5000, // Refrescar cada 5 segundos como fallback
  });

  // Apollo mutation para dar like
  const [likePostMutation] = useMutation(LIKE_POST, {
    // Actualización optimista del caché
    update(cache, { data: { likePost } }) {
      try {
        // Leer la query actual del caché
        const existingPosts = cache.readQuery({
          query: GET_POSTS,
        });

        // Actualizar el post específico en el caché
        const updatedPosts = existingPosts.posts.map((post) =>
          post.id === likePost.id ? likePost : post
        );

        // Escribir los datos actualizados al caché
        cache.writeQuery({
          query: GET_POSTS,
          data: {
            posts: updatedPosts,
          },
        });

      } catch (error) {
        console.error("Error actualizando like en caché:", error);
      }
    },

    onError: (error) => {
      console.error("Error al dar like:", error);
    },
  });

  // Función para manejar likes con GraphQL
  const handleLike = async (postId) => {
    try {
      await likePostMutation({
        variables: { id: postId },
      });
    } catch (error) {
      console.error("Error al dar like:", error);
    }
  };

  // Obtener posts de Apollo Client
  const posts = graphqlData?.posts || [];

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
        padding: "20px",
        backgroundColor: "#0a0a0a",
        minHeight: "100vh",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#ffffff",
          marginBottom: "30px",
          fontSize: "28px",
          fontWeight: "700",
          textShadow: "0 2px 4px rgba(0,0,0,0.5)",
        }}
      >
        News Feed
      </h1>

      <PostForm />

      {/* Indicador de loading de GraphQL */}
      {graphqlLoading && posts.length === 0 && (
        <div
          style={{
            textAlign: "center",
            color: "#ffffff",
            padding: "20px",
            fontSize: "16px",
          }}
        >
          Cargando posts desde GraphQL...
        </div>
      )}

      {/* Indicador de error de GraphQL */}
      {graphqlError && (
        <div
          style={{
            textAlign: "center",
            color: "#ff6b6b",
            padding: "20px",
            fontSize: "14px",
            backgroundColor: "#2a1a1a",
            margin: "10px 0",
            borderRadius: "8px",
            border: "1px solid #ff6b6b",
          }}
        >
         Error conectando con GraphQL: {graphqlError.message}
          <br />
          <small>Usando datos de respaldo...</small>
        </div>
      )}

      {posts.map((post, i) => {
        return (
          <Post
            key={post.id} // Usar solo el ID como key
            title={post.title}
            body={post.body}
            liked={post.userLiked}
            likesCount={post.likesCount || 0}
            author={post.author || "Usuario"}
            onLike={() => handleLike(post.id)}
          />
        );
      })}

      {/* Indicador de loading específico para cuando no hay posts */}
      {graphqlLoading && posts.length === 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#b0b0b0",
            fontSize: "16px",
            margin: "20px 0",
          }}
        >
          Cargando publicaciones...
        </p>
      )}

      {/* Mensaje cuando ya se cargaron todos los posts disponibles */}
      {!graphqlLoading && posts.length > 0 && (
        <p
          style={{
            textAlign: "center",
            color: "#808080",
            fontSize: "14px",
            margin: "20px 0",
            fontStyle: "italic",
          }}
        >
          {posts.length} publicaciones cargadas
        </p>
      )}

      {/* Mensaje cuando no hay posts en absoluto */}
      {!graphqlLoading && posts.length === 0 && !graphqlError && (
        <p
          style={{
            textAlign: "center",
            color: "#808080",
            fontSize: "16px",
            margin: "20px 0",
            fontStyle: "italic",
          }}
        >
          No hay publicaciones aún. ¡Crea la primera!
        </p>
      )}
    </div>
  );
}

export default App;
