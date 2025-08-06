import { pool } from '../config/db.js';

class Blog {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.content = data.content;
    this.excerpt = data.excerpt;
    this.hero_image = data.hero_image;
    this.author_id = data.author_id;
    this.tags = typeof data.tags === 'string' ? JSON.parse(data.tags) : data.tags;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
    
    // Include author info if available
    if (data.author_username) {
      this.author = {
        id: data.author_id,
        username: data.author_username,
        email: data.author_email,
        avatar: data.author_avatar
      };
    }
  }

  // Create a new blog post
  static async create(blogData) {
    const { title, content, excerpt, hero_image, author_id, tags } = blogData;

    try {
      const [result] = await pool.execute(
        'INSERT INTO blogs (title, content, excerpt, hero_image, author_id, tags) VALUES (?, ?, ?, ?, ?, ?)',
        [title, content, excerpt, hero_image || null, author_id, JSON.stringify(tags || [])]
      );

      return await Blog.findById(result.insertId);
    } catch (error) {
      throw error;
    }
  }

  // Find blog by ID with author information
  static async findById(id) {
    try {
      const [rows] = await pool.execute(`
        SELECT 
          b.*,
          u.username as author_username,
          u.email as author_email,
          u.avatar as author_avatar
        FROM blogs b
        JOIN users u ON b.author_id = u.id
        WHERE b.id = ?
      `, [id]);

      return rows.length > 0 ? new Blog(rows[0]) : null;
    } catch (error) {
      throw error;
    }
  }

  // Get all blogs with pagination and optional filters
  static async findAll(options = {}) {
    const { 
      page = 1, 
      limit = 10, 
      authorId, 
      search, 
      tags 
    } = options;
    
    const offset = (page - 1) * limit;
    let query = `
      SELECT 
        b.*,
        u.username as author_username,
        u.email as author_email,
        u.avatar as author_avatar
      FROM blogs b
      JOIN users u ON b.author_id = u.id
    `;
    let whereConditions = [];
    let queryParams = [];

    // Add filters
    if (authorId) {
      whereConditions.push('b.author_id = ?');
      queryParams.push(authorId);
    }

    if (search) {
      whereConditions.push('(b.title LIKE ? OR b.content LIKE ? OR b.excerpt LIKE ?)');
      const searchTerm = `%${search}%`;
      queryParams.push(searchTerm, searchTerm, searchTerm);
    }

    if (tags && tags.length > 0) {
      whereConditions.push('JSON_OVERLAPS(b.tags, ?)');
      queryParams.push(JSON.stringify(tags));
    }

    if (whereConditions.length > 0) {
      query += ' WHERE ' + whereConditions.join(' AND ');
    }

    query += ' ORDER BY b.created_at DESC LIMIT ? OFFSET ?';
    queryParams.push(limit, offset);

    try {
      const [rows] = await pool.execute(query, queryParams);
      
      // Get total count for pagination
      let countQuery = 'SELECT COUNT(*) as total FROM blogs b';
      let countParams = [];
      
      if (whereConditions.length > 0) {
        countQuery += ' WHERE ' + whereConditions.join(' AND ');
        countParams = queryParams.slice(0, -2); // Remove limit and offset
      }
      
      const [countResult] = await pool.execute(countQuery, countParams);
      const total = countResult[0].total;

      return {
        blogs: rows.map(row => new Blog(row)),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  }

  // Update blog post
  static async update(id, blogData) {
    const { title, content, excerpt, hero_image, tags } = blogData;

    try {
      await pool.execute(
        'UPDATE blogs SET title = ?, content = ?, excerpt = ?, hero_image = ?, tags = ? WHERE id = ?',
        [title, content, excerpt, hero_image, JSON.stringify(tags || []), id]
      );

      return await Blog.findById(id);
    } catch (error) {
      throw error;
    }
  }

  // Delete blog post
  static async delete(id) {
    try {
      const [result] = await pool.execute(
        'DELETE FROM blogs WHERE id = ?',
        [id]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  // Get blogs by author
  static async findByAuthor(authorId, options = {}) {
    return await Blog.findAll({ ...options, authorId });
  }

  // Search blogs
  static async search(searchTerm, options = {}) {
    return await Blog.findAll({ ...options, search: searchTerm });
  }

  // Get blogs by tags
  static async findByTags(tags, options = {}) {
    return await Blog.findAll({ ...options, tags });
  }
}

export default Blog;