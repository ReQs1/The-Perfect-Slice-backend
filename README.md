# PizzaBlog Backend

This project is the backend API for PizzaBlog – a blog application featuring Google authentication, comments, and likes. It is built with Node.js, Express, and Postgres (using Neon Database). The server uses JWT for authentication and passport for Google OAuth integration.

## Features

- **Google OAuth Authentication**
  - Users can sign in with Google.
  - New users are saved to the database.
  - JWT tokens (access and refresh) are generated and sent as cookies.
- **User Management**

  - Get user information.
  - Refresh access tokens.
  - Logout functionality (clearing cookies).

- **Comments**

  - Retrieve all comments for a given post.
  - Add new comments with validation (maximum 1000 characters).
  - Update and delete comments (only by the comment owner or an admin).
  - Get the total number of comments per post.

- **Likes**

  - Like and unlike posts with proper validation (to prevent duplicate likes or unliking a non-existent like).
  - Retrieve the like count for a post.
  - Retrieve a list of posts a user has liked – useful to mark posts with a red heart on the frontend.

- **Security**
  - Rate limiting on global and authentication endpoints.
  - CORS is set up to work with the frontend.
  - Cookie-based storage for tokens, with HTTP-only, secure, and same-site attributes.

## Installation

1. **Clone the repository:**

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Configure your environment variables:**  
   Create a `.env` file in the root directory with the following variables:
   ```
   DATABASE_URL=your_database_url
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   JWT_SECRET=your_jwt_secret
   JWT_REFRESH_SECRET=your_jwt_refresh_secret
   SERVER_URL=your_server_url (e.g. http://localhost:5000)
   CLIENT_URL=your_client_url (e.g. http://localhost:5173)
   NODE_ENV=development
   ```

## Running the Application

- **Development Mode:**  
  Use nodemon for hot-reloading:
  ```
  npm run dev
  ```

## API Endpoints

- **Authentication**

  - `GET /auth/google` – Initiates Google OAuth login.
  - `GET /auth/google/callback` – Processes Google OAuth callback.
  - `GET /auth/user` – Retrieves authenticated user's info.
  - `POST /auth/refresh-token` – Refreshes access token.
  - `POST /auth/logout` – Logs out the user.

- **Comments**

  - `GET /posts/:postId/comments` – List comments for a post.
  - `POST /posts/:postId/comments` – Add a comment (requires authentication).
  - `PATCH /comments/:commentId` – Update a comment (only by owner).
  - `DELETE /comments/:commentId` – Delete a comment (owner or admin).
  - `GET /posts/:postId/comments-count` – Get total comment count for a post.

- **Likes**
  - `POST /posts/:postId/like` – Like a post (requires authentication).
  - `DELETE /posts/:postId/like` – Unlike a post (requires authentication).
  - `GET /posts/:postId/likes-count` – Get total likes count for a post.
  - `GET /user/liked-posts` – Retrieve posts liked by the user.
