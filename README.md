# NewsFeed

A simple and modern social media application built with React and Redux.

## Description

NewsFeed is a web application that allows users to create, view, and like posts. It features an elegant dark design and an intuitive interface with infinite scroll to automatically load more content.

## Features

- Create new posts with title and content
- View post feed with infinite scroll
- Real-time like system
- Responsive design with dark theme
- Floating modal for creating posts
- Automatic content loading from external API

## Technologies used

- React
- Redux Toolkit for state management
- Vite as build tool
- Axios for HTTP requests
- CSS-in-JS for styling

## Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```

## Usage

- Click the green floating button to create a new post
- Scroll down to automatically load more posts
- Click "Like" to like a post

## Project structure

- `src/components/` - React components
- `src/features/posts/` - Redux logic for posts
- `src/app/` - Redux store configuration
