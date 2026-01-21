Mindful CMS Backend - API Documentation
Base URL: http://localhost:3000/api/v1

Authentication
Register
Create a new user account (automatically becomes OWNER).

Endpoint: POST /api/v1/auth/register
Auth Required: No
Request Body:

{
  "email": "user@example.com",
  "password": "password123" // Minimum 8 characters
}
Response (201 Created):

{
  "user": {
    "id": "cmk...",
    "email": "user@example.com",
    "role": "OWNER",
    "createdAt": "2026-01-21T..."
  },
  "tokens": {
    "accessToken": "eyJ...", // Expires in 15m
    "refreshToken": "eyJ..." // Expires in 7d
  }
}
Login
Authenticate and receive tokens.

Endpoint: POST /api/v1/auth/login
Auth Required: No
Request Body:

{
  "email": "user@example.com",
  "password": "password123"
}
Response (200 OK):

// Same structure as Register response
{
  "user": { ... },
  "tokens": { ... }
}
Refresh Token
Get a new access token using a valid refresh token.

Endpoint: POST /api/v1/auth/refresh
Auth Required: No
Request Body:

{
  "refreshToken": "eyJ..."
}
Response (200 OK):

{
  "accessToken": "eyJ...",
  "refreshToken": "eyJ..." // New refresh token
}
Get Me
Get current user details.

Endpoint: GET /api/v1/auth/me
Auth Required: Yes
Response (200 OK):

{
  "user": {
    "userId": "cmk...",
    "email": "user@example.com",
    "role": "OWNER"
  }
}
Blogs
Create Blog
Create a new blog tenant.

Endpoint: POST /api/v1/blogs
Auth Required: Yes
Request Body:

{
  "slug": "my-blog", // Lowercase, alphanumeric, hyphens
  "title": "My Awesome Blog",
  "description": "A description of my blog" // Optional
}
Response (201 Created):

{
  "id": "blog_123...",
  "slug": "my-blog",
  "title": "My Awesome Blog",
  "ownerId": "cmk..."
}
Get My Blogs
List blogs owned by the current user.

Endpoint: GET /api/v1/blogs/my
Auth Required: Yes
Response (200 OK):

[
  {
    "id": "blog_123...",
    "title": "My Awesome Blog",
    "role": "OWNER"
  }
]
Posts
Create Post
Create a new post in a specific blog.

Endpoint: POST /api/v1/blogs/:blogId/posts
Auth Required: Yes
Request Body:

{
  "title": "My First Post",
  "slug": "my-first-post",
  "content": "# Hello World\nThis is the content.",
  "excerpt": "Short summary", // Optional
  "coverImageUrl": "https://...", // Optional
  "categoryIds": ["cat_123"], // Optional
  "tagIds": ["tag_456"] // Optional
}
Response (201 Created):

{
  "id": "post_789...",
  "title": "My First Post",
  "status": "DRAFT",
  "authorId": "cmk..."
}
List Posts (Author)
List all posts for a blog with filtering (Author view).

Endpoint: GET /api/v1/blogs/:blogId/posts
Auth Required: Yes
Query Params:
page: Number (default 1)
limit: Number (default 20)
status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
categoryId: ID
tagId: ID
Response (200 OK):

{
  "data": [ 
    {
      "id": "post_789...",
      "title": "My First Post",
      "featured": false,
      "readTimeMinutes": 5,
      "publishedAt": "2026-01-21T...",
      "author": {
        "id": "user_123",
        "email": "user@ex.com",
        "avatarUrl": "https://..."
      }
    } 
  ],
  "meta": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
List Posts (Public)
List published posts for a blog (Public view).

Endpoint: GET /api/v1/public/blogs/:blogSlug/posts
Auth Required: No
Query Params:
search: String (Search title/content)
page, limit, categoryId, tagId
Get Post (Public)
Get a single published post.

Endpoint: GET /api/v1/public/blogs/:blogSlug/posts/:postSlug
Auth Required: No
Response (200 OK):

{
  "id": "post_789...",
  "title": "My First Post",
  "content": "...",
  "author": { "name": "..." },
  "categories": [ ... ],
  "tags": [ ... ]
}
Interactions
Like Post
Like a post.

Endpoint: POST /api/v1/posts/:postId/like
Auth Required: Optional (Tracks by User ID or IP)
Response (200 OK):

{
  "liked": true
}
Bookmark Post
Bookmark a post.

Endpoint: POST /api/v1/posts/:postId/bookmark
Auth Required: Yes
Response (200 OK):

{
  "bookmarked": true
}
Uploads
Upload Avatar
Upload user profile picture.

Endpoint: POST /api/v1/avatar
Auth Required: Yes
Content-Type: multipart/form-data
Request:

file
: (Binary file data)
Response (200 OK):

{
  "url": "https://supabase.../avatar.jpg"
}
Authors
Get Public Profile
Get author's public profile and stats.

Endpoint: GET /api/v1/authors/:authorId/profile
Auth Required: No
Response (200 OK):

{
  "id": "profile_123",
  "bio": "Tech enthusiast",
  "location": "San Francisco, CA",
  "avatarUrl": "https://...",
  "website": "https://...",
  "twitter": "@user",
  "github": "user",
  "postCount": 42,
  "followerCount": 150,
  "followingCount": 10
}
Taxonomy
Create Category
Endpoint: POST /api/v1/blogs/:blogId/categories
Auth Required: Yes
Body: { "name": "Tech", "slug": "tech", "parentId": "optional_id" }
Get Categories (Tree)
Endpoint: GET /api/v1/blogs/:blogId/categories/hierarchy
Auth Required: No
Response: [{ "id": "...", "name": "Tech", "children": [...] }]
Create Tag
Endpoint: POST /api/v1/blogs/:blogId/tags
Auth Required: Yes
Body: { "name": "React", "slug": "react" }
Analytics
Track Read Time
Endpoint: POST /api/v1/analytics/read-time
Auth Required: Optional
Body: { "postId": "...", "readTimeSeconds": 60, "sessionId": "..." }
Author Dashboard
Endpoint: GET /api/v1/analytics/dashboard
Auth Required: Yes
Response:
{
  "totalViews": 1000,
  "totalLikes": 500,
  "totalBookmarks": 200,
  "topPosts": [...]
}