import { useEffect, useRef, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMorePosts, setPage, toggleLike } from "./features/posts/postSlice";
import axios from "axios";

import Post from "./components/PostCard";
import PostForm from "./components/PostForm";

function App() {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.posts.list);
  const page = useSelector((state) => state.posts.page);

  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastPostRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          dispatch(setPage(page + 1)); // reemplaza setPage de useState
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page, dispatch]
  );

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
        );

        if (response.data.length === 0) {
          setHasMore(false);
        } else {
          dispatch(addMorePosts(response.data));
        }
      } catch (error) {
        console.error("Error fetching posts", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [page, dispatch]);

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

      {posts.map((post, i) => {
        const uniqueKey = `${post.id}-${i}`; // Key más único combinando id e índice

        if (i === posts.length - 1) {
          return (
            <Post
              key={uniqueKey}
              ref={lastPostRef}
              title={post.title}
              body={post.body}
              liked={post.liked}
              likesCount={post.likesCount}
              onLike={() => dispatch(toggleLike(post.id))}
            />
          );
        }

        return (
          <Post
            key={uniqueKey}
            title={post.title}
            body={post.body}
            liked={post.liked}
            likesCount={post.likesCount}
            onLike={() => dispatch(toggleLike(post.id))}
          />
        );
      })}

      {loading && (
        <p
          style={{
            textAlign: "center",
            color: "#b0b0b0",
            fontSize: "16px",
            margin: "20px 0",
          }}
        >
          Cargando más publicaciones...
        </p>
      )}
      {!hasMore && (
        <p
          style={{
            textAlign: "center",
            color: "#808080",
            fontSize: "16px",
            margin: "20px 0",
            fontStyle: "italic",
          }}
        >
          No hay más publicaciones
        </p>
      )}
    </div>
  );
}

export default App;
