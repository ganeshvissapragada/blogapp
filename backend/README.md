# BlogApp Backend

A complete Node.js backend for the BlogApp with MySQL integration, authentication, and blog management.

## Features

- **User Authentication**: Registration, login, profile management with JWT tokens
- **Blog Management**: CRUD operations for blog posts with rich content support
- **Database Integration**: MySQL database with connection pooling
- **Security**: Helmet, CORS, rate limiting, password hashing
- **Validation**: Input validation using express-validator
- **Error Handling**: Comprehensive error handling and logging

## Quick Start

### Prerequisites

- Node.js 16+ 
- MySQL 5.7+ or 8.0+
- npm or yarn

### Installation

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:3000
   
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=blogapp
   
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   ```

4. **Set up MySQL database**
   ```sql
   CREATE DATABASE blogapp;
   ```
   
   The application will automatically create the required tables on startup.

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## API Endpoints

### Authentication (`/api/auth`)

- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `GET /profile` - Get user profile (protected)
- `PUT /profile` - Update user profile (protected)

### Blogs (`/api/blogs`)

- `GET /` - Get all blogs (with pagination, search, filters)
- `GET /search` - Search blogs
- `GET /:id` - Get single blog
- `POST /` - Create new blog (protected)
- `PUT /:id` - Update blog (protected, author only)
- `DELETE /:id` - Delete blog (protected, author only)
- `GET /user/my-blogs` - Get current user's blogs (protected)

### Health Check

- `GET /health` - Server health check

## Database Schema

### Users Table
- `id` - Primary key
- `username` - Unique username
- `email` - Unique email address
- `password` - Hashed password
- `avatar` - Profile avatar URL
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

### Blogs Table
- `id` - Primary key
- `title` - Blog title
- `content` - Blog content (TEXT)
- `excerpt` - Blog excerpt
- `hero_image` - Hero image URL
- `author_id` - Foreign key to users table
- `tags` - JSON array of tags
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 req/15min general, 5 req/15min auth)
- CORS protection
- Security headers with Helmet
- Input validation and sanitization
- SQL injection prevention with parameterized queries

## Development

### Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Environment Variables

See `.env.example` for all available configuration options.

### Testing

The backend includes comprehensive error handling and logging for debugging purposes.

## Production Deployment

1. Set `NODE_ENV=production`
2. Configure production database
3. Set secure JWT secret
4. Configure CORS for production frontend URL
5. Set up SSL/TLS termination
6. Configure process manager (PM2, etc.)
7. Set up monitoring and logging