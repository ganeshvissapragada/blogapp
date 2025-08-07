import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../app.js';

// Mock the database connection to avoid actual DB operations
jest.mock('../config/db.js', () => ({
  pool: {
    execute: jest.fn(),
    getConnection: jest.fn(() => Promise.resolve({ release: jest.fn() }))
  },
  testConnection: jest.fn(() => Promise.resolve()),
  initializeDatabase: jest.fn(() => Promise.resolve())
}));

// Mock the Blog model
jest.mock('../models/blog.js', () => ({
  default: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

// Mock the User model  
jest.mock('../models/user.js', () => ({
  default: {
    findById: jest.fn()
  }
}));

import Blog from '../models/blog.js';
import User from '../models/user.js';

describe('Blog Controller - User-specific functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/blogs', () => {
    const mockBlogs = [
      { id: 1, title: 'Blog 1', content: 'Content 1', author_id: 1 },
      { id: 2, title: 'Blog 2', content: 'Content 2', author_id: 1 }
    ];

    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      toJSON: () => ({ id: 1, username: 'testuser', email: 'test@example.com' })
    };

    it('should return all blogs when user is not authenticated', async () => {
      Blog.findAll.mockResolvedValue({
        blogs: mockBlogs,
        pagination: { page: 1, limit: 10, total: 2, pages: 1 }
      });

      const response = await request(app)
        .get('/api/blogs')
        .expect(200);

      expect(response.body.message).toBe('Blogs retrieved successfully');
      expect(Blog.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10
      });
    });

    it('should return only user blogs when user is authenticated', async () => {
      // Mock user authentication
      User.findById.mockResolvedValue(mockUser);
      
      const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
      
      Blog.findAll.mockResolvedValue({
        blogs: mockBlogs,
        pagination: { page: 1, limit: 10, total: 2, pages: 1 }
      });

      const response = await request(app)
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('Your blogs retrieved successfully');
      expect(Blog.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        authorId: 1
      });
    });

    it('should allow authenticated user to view specific author blogs via query param', async () => {
      // Mock user authentication
      User.findById.mockResolvedValue(mockUser);
      
      const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
      
      Blog.findAll.mockResolvedValue({
        blogs: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 }
      });

      const response = await request(app)
        .get('/api/blogs?author=2')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(Blog.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        authorId: 2
      });
    });
  });

  describe('GET /api/blogs/user/my-blogs', () => {
    const mockUser = {
      id: 1,
      username: 'testuser',
      email: 'test@example.com',
      toJSON: () => ({ id: 1, username: 'testuser', email: 'test@example.com' })
    };

    it('should return user blogs when authenticated', async () => {
      User.findById.mockResolvedValue(mockUser);
      
      const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
      
      const mockBlogs = [
        { id: 1, title: 'My Blog 1', content: 'Content 1', author_id: 1 }
      ];

      Blog.findAll.mockResolvedValue({
        blogs: mockBlogs,
        pagination: { page: 1, limit: 10, total: 1, pages: 1 }
      });

      const response = await request(app)
        .get('/api/blogs/user/my-blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.message).toBe('User blogs retrieved successfully');
      expect(Blog.findAll).toHaveBeenCalledWith({
        page: 1,
        limit: 10,
        authorId: 1
      });
    });

    it('should require authentication', async () => {
      const response = await request(app)
        .get('/api/blogs/user/my-blogs')
        .expect(401);

      expect(response.body.error).toBe('Access denied. No token provided.');
    });
  });
});