// Simple integration test that validates the key functionality without database dependency
import { getAllBlogs } from '../controllers/blogController.js';

describe('Blog Controller Integration', () => {
  // Mock Blog model
  const mockBlog = {
    findAll: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Replace the Blog import in the controller
    jest.doMock('../models/blog.js', () => ({
      default: mockBlog
    }));
  });

  test('getAllBlogs filters by user when authenticated', async () => {
    // Setup
    const req = {
      query: {},
      user: { id: 123, username: 'testuser' }
    };
    const res = {
      json: jest.fn()
    };

    const mockResult = {
      blogs: [{ id: 1, title: 'Test Blog', author_id: 123 }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 }
    };

    mockBlog.findAll.mockResolvedValue(mockResult);

    // Execute
    await getAllBlogs(req, res);

    // Verify
    expect(mockBlog.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      authorId: 123
    });

    expect(res.json).toHaveBeenCalledWith({
      message: 'Your blogs retrieved successfully',
      ...mockResult
    });
  });

  test('getAllBlogs shows all blogs when not authenticated', async () => {
    // Setup
    const req = {
      query: {},
      user: null
    };
    const res = {
      json: jest.fn()
    };

    const mockResult = {
      blogs: [
        { id: 1, title: 'Blog 1', author_id: 123 },
        { id: 2, title: 'Blog 2', author_id: 456 }
      ],
      pagination: { page: 1, limit: 10, total: 2, pages: 1 }
    };

    mockBlog.findAll.mockResolvedValue(mockResult);

    // Execute
    await getAllBlogs(req, res);

    // Verify
    expect(mockBlog.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10
    });

    expect(res.json).toHaveBeenCalledWith({
      message: 'Blogs retrieved successfully',
      ...mockResult
    });
  });

  test('getAllBlogs respects author query parameter even when authenticated', async () => {
    // Setup
    const req = {
      query: { author: '456' },
      user: { id: 123, username: 'testuser' }
    };
    const res = {
      json: jest.fn()
    };

    const mockResult = {
      blogs: [{ id: 2, title: 'Other User Blog', author_id: 456 }],
      pagination: { page: 1, limit: 10, total: 1, pages: 1 }
    };

    mockBlog.findAll.mockResolvedValue(mockResult);

    // Execute
    await getAllBlogs(req, res);

    // Verify
    expect(mockBlog.findAll).toHaveBeenCalledWith({
      page: 1,
      limit: 10,
      authorId: 456
    });
  });
});