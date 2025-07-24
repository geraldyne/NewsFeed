import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  page: 1,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts(state, action) {
      const postsWithLiked = action.payload.map((post) => ({
        ...post,
        id: `api_${post.id}`, // Prefijo para distinguir de posts creados
        liked: false,
        likesCount: Math.floor(Math.random() * 50), // Simulamos likes aleatorios
      }));
      state.list = postsWithLiked;
    },
    addMorePosts(state, action) {
      const postsWithLiked = action.payload.map((post) => ({
        ...post,
        id: `api_${post.id}`, // Prefijo para distinguir de posts creados
        liked: false,
        likesCount: Math.floor(Math.random() * 50), // Simulamos likes aleatorios
      }));

      // Filtrar posts que ya existen para evitar duplicados
      const newPosts = postsWithLiked.filter(
        (newPost) =>
          !state.list.some((existingPost) => existingPost.id === newPost.id)
      );

      state.list = [...state.list, ...newPosts];
    },
    addPost(state, action) {
      const newPost = {
        ...action.payload,
        id: `new_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // ID más único
        liked: false,
        likesCount: 0,
      };
      state.list.unshift(newPost); // Agregamos al inicio
    },
    setPage(state, action) {
      state.page = action.payload;
    },
    toggleLike: (state, action) => {
      const postId = action.payload;
      const post = state.list.find((p) => p.id === postId);
      if (post) {
        post.liked = !post.liked;
        // Incrementamos o decrementamos el contador
        post.likesCount += post.liked ? 1 : -1;
      }
    },
  },
});

export const { setPosts, addMorePosts, setPage, toggleLike, addPost } =
  postsSlice.actions;

export default postsSlice.reducer;
