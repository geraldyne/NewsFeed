import { gql } from "@apollo/client";

// 📋 QUERIES (Obtener datos)

export const GET_POSTS = gql`
  query GetPosts {
    posts {
      id
      title
      body
      author {
        name
        username
        avatar
      }
      likesCount
      userLiked
      createdAt
      views
      commentsCount
      readTime
      tags
      isBookmarked
      trending
      timestamp
    }
  }
`;

export const GET_POST_BY_ID = gql`
  query GetPostById($id: ID!) {
    post(id: $id) {
      id
      title
      body
      author {
        name
        username
        avatar
      }
      likesCount
      userLiked
      createdAt
      views
      commentsCount
      readTime
      tags
      isBookmarked
      trending
      timestamp
    }
  }
`;

// ✏️ MUTATIONS (Modificar datos)

export const CREATE_POST = gql`
  mutation CreatePost(
    $title: String!
    $body: String!
    $authorName: String!
    $authorUsername: String
    $tags: [String!]
  ) {
    createPost(
      title: $title
      body: $body
      authorName: $authorName
      authorUsername: $authorUsername
      tags: $tags
    ) {
      id
      title
      body
      author {
        name
        username
        avatar
      }
      likesCount
      userLiked
      createdAt
      views
      commentsCount
      readTime
      tags
      isBookmarked
      trending
      timestamp
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
      author {
        name
        username
        avatar
      }
      views
      commentsCount
      readTime
      tags
      isBookmarked
      trending
      timestamp
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
