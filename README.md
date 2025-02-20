# The Perfect Slice blog backend in express

## endpoints

Authentication Endpoints

GET         /auth/google            Google OAuth login
GET         /auth/user              Get current user info
POST        /auth/refresh-token     Refresh access token

Blog Operations

GET             /api/blogs              List all blogs     None
GET             /api/blogs/:id          Get single blog    None
POST            /api/blogs              Create new blog    Owner
PUT             /api/blogs/:id          Update blog        Owner
DELETE          /api/blogs/:id          Delete blog         Owner

Comment Operations

GET                 /api/blogs/:blogId/comments             Get blog comments       None
POST                /api/blogs/:blogId/comments             Add comment             Required account
PUT                 /api/blogs/:blogId/comments/:commentId  Update comment          Owner/comment author
DELETE              /api/blogs/:blogId/comments/:commentId  Delete comment          Owner/comment author
