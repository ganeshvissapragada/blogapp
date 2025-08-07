import { validationResult } from 'express-validator';
import Blog from '../models/blog.js';

// Get all blogs with pagination and filters
export const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tags,
      author
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit)
    };

    if (search) {
      options.search = search;
    }

    if (tags) {
      // Handle both string and array formats
      options.tags = Array.isArray(tags) ? tags : tags.split(',');
    }

    if (author) {
      options.authorId = parseInt(author);
    } else if (req.user) {
      // If user is authenticated and no specific author filter, show only their blogs
      options.authorId = req.user.id;
    }

    const result = await Blog.findAll(options);

    res.json({
      message: req.user ? 'Your blogs retrieved successfully' : 'Blogs retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    res.status(500).json({
      error: 'Server error while fetching blogs'
    });
  }
};

// Get single blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    res.json({
      message: 'Blog retrieved successfully',
      blog
    });
  } catch (error) {
    console.error('Get blog by ID error:', error);
    res.status(500).json({
      error: 'Server error while fetching blog'
    });
  }
};

// Create new blog
export const createBlog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { title, content, excerpt, hero_image, tags } = req.body;
    const author_id = req.user.id;

    const blog = await Blog.create({
      title,
      content,
      excerpt,
      hero_image,
      author_id,
      tags: tags || []
    });

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({
      error: 'Server error while creating blog'
    });
  }
};

// Update blog
export const updateBlog = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: 'Validation failed',
        details: errors.array()
      });
    }

    const { id } = req.params;
    const { title, content, excerpt, hero_image, tags } = req.body;

    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check if user is the author
    if (existingBlog.author_id !== req.user.id) {
      return res.status(403).json({
        error: 'You can only update your own blogs'
      });
    }

    const updatedBlog = await Blog.update(id, {
      title,
      content,
      excerpt,
      hero_image,
      tags: tags || []
    });

    res.json({
      message: 'Blog updated successfully',
      blog: updatedBlog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({
      error: 'Server error while updating blog'
    });
  }
};

// Delete blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if blog exists
    const existingBlog = await Blog.findById(id);
    if (!existingBlog) {
      return res.status(404).json({
        error: 'Blog not found'
      });
    }

    // Check if user is the author
    if (existingBlog.author_id !== req.user.id) {
      return res.status(403).json({
        error: 'You can only delete your own blogs'
      });
    }

    const deleted = await Blog.delete(id);
    if (!deleted) {
      return res.status(500).json({
        error: 'Failed to delete blog'
      });
    }

    res.json({
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({
      error: 'Server error while deleting blog'
    });
  }
};

// Get user's blogs
export const getUserBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      tags
    } = req.query;

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      authorId: req.user.id
    };

    if (search) {
      options.search = search;
    }

    if (tags) {
      options.tags = Array.isArray(tags) ? tags : tags.split(',');
    }

    const result = await Blog.findAll(options);

    res.json({
      message: 'User blogs retrieved successfully',
      ...result
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({
      error: 'Server error while fetching user blogs'
    });
  }
};

// Search blogs
export const searchBlogs = async (req, res) => {
  try {
    const {
      q: searchTerm,
      page = 1,
      limit = 10,
      tags
    } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        error: 'Search term is required'
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      search: searchTerm
    };

    if (tags) {
      options.tags = Array.isArray(tags) ? tags : tags.split(',');
    }

    const result = await Blog.findAll(options);

    res.json({
      message: 'Search results retrieved successfully',
      searchTerm,
      ...result
    });
  } catch (error) {
    console.error('Search blogs error:', error);
    res.status(500).json({
      error: 'Server error while searching blogs'
    });
  }
};