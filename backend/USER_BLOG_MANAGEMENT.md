# User-Specific Blog Management Implementation

## Overview
This implementation adds user-specific blog management functionality to ensure that authenticated users only see their own blogs by default, while maintaining public access for unauthenticated users.

## Changes Made

### 1. Route Ordering Fix (`routes/blogRoutes.js`)
- **Issue**: The route `/user/my-blogs` was defined after `/:id`, causing conflicts
- **Fix**: Moved specific routes before parameterized routes to ensure proper matching
- **Impact**: The `/api/blogs/user/my-blogs` endpoint now works correctly

### 2. Enhanced getAllBlogs Function (`controllers/blogController.js`)
- **Change**: Modified the `getAllBlogs` function to automatically filter by user ID when authenticated
- **Logic**:
  - **Unauthenticated users**: See all blogs (public access)
  - **Authenticated users**: See only their own blogs by default
  - **Query parameter override**: Authenticated users can still view specific authors' blogs using `?author=X`
- **Response messages**: Different messages for authenticated vs unauthenticated users

### 3. Test Coverage (`tests/`)
- Added comprehensive tests for user-specific filtering logic
- Tests cover all scenarios:
  - Unauthenticated access
  - Authenticated user default filtering
  - Query parameter override functionality
  - Error handling

## API Behavior

### GET /api/blogs
- **Without authentication**: Returns all blogs
- **With authentication**: Returns only the authenticated user's blogs
- **With author query**: Returns blogs from specified author (e.g., `?author=123`)

### GET /api/blogs/user/my-blogs
- **Requires authentication**: Returns the authenticated user's blogs
- **Same functionality as** `/api/blogs` when authenticated, but explicit endpoint

## Security Features
- User ownership verification for all modify operations (create/update/delete)
- Automatic filtering ensures users can't accidentally see other users' blogs
- Query parameter allows intentional viewing of other users' public blogs

## Database Schema
The existing database schema already supports user-specific blogs:
```sql
CREATE TABLE blogs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  excerpt TEXT,
  hero_image VARCHAR(500),
  author_id INT NOT NULL,
  tags JSON,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## Migration Notes
- No database migration required (schema already supports user relationships)
- Backward compatible with existing API consumers
- Existing blog data will be filtered correctly based on author_id