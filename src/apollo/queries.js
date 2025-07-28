import { gql } from "@apollo/client";

// 📋 QUERIES (Obtener datos)

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      body
      author
      likesCount
      userLiked
      createdAt
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      body
      author
      likesCount
      userLiked
      createdAt
    }
  }
`;

// ✏️ MUTATIONS (Modificar datos)

export const CREATE_POST = gql`
  mutation CreatePost($title: String!, $body: String!, $author: String!) {
    createPost(title: $title, body: $body, author: $author) {
      id
      title
      body
      author
      likesCount
      userLiked
      createdAt
    }
  }
`;

export const LIKE_POST = gql`
  mutation LikePost($id: ID!) {
    likePost(id: $id) {
      id
      title
      likesCount
      userLiked
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: ID!) {
    deletePost(id: $id) {
      success
      message
    }
  }
`;
