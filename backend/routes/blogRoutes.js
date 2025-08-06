import express from 'express';
import { body } from 'express-validator';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getUserBlogs,
  searchBlogs
} from '../controllers/blogController.js';
import { authMiddleware, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// Validation rules
const blogValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title is required and must be less than 255 characters'),
  
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  
  body('hero_image')
    .optional()
    .isURL()
    .withMessage('Hero image must be a valid URL'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
];

const updateBlogValidation = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Title must be less than 255 characters'),
  
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  
  body('excerpt')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Excerpt must be less than 500 characters'),
  
  body('hero_image')
    .optional()
    .isURL()
    .withMessage('Hero image must be a valid URL'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Each tag must be between 1 and 50 characters')
];

// Public routes
router.get('/', optionalAuth, getAllBlogs);
router.get('/search', optionalAuth, searchBlogs);
router.get('/:id', optionalAuth, getBlogById);

// Protected routes
router.post('/', authMiddleware, blogValidation, createBlog);
router.put('/:id', authMiddleware, updateBlogValidation, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);
router.get('/user/my-blogs', authMiddleware, getUserBlogs);

export default router;