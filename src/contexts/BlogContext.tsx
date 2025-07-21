import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Blog, BlogState } from '../types';
import { useAuth } from './AuthContext';

interface BlogContextType extends BlogState {
  createBlog: (blog: Omit<Blog, 'id' | 'author' | 'createdAt' | 'updatedAt'>) => void;
  updateBlog: (id: string, blog: Partial<Blog>) => void;
  deleteBlog: (id: string) => void;
  getBlog: (id: string) => Blog | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

type BlogAction =
  | { type: 'SET_BLOGS'; payload: Blog[] }
  | { type: 'ADD_BLOG'; payload: Blog }
  | { type: 'UPDATE_BLOG'; payload: { id: string; blog: Partial<Blog> } }
  | { type: 'DELETE_BLOG'; payload: string }
  | { type: 'SET_CURRENT_BLOG'; payload: Blog | null }
  | { type: 'SET_LOADING'; payload: boolean };

const blogReducer = (state: BlogState, action: BlogAction): BlogState => {
  switch (action.type) {
    case 'SET_BLOGS':
      return { ...state, blogs: action.payload };
    case 'ADD_BLOG':
      return { ...state, blogs: [action.payload, ...state.blogs] };
    case 'UPDATE_BLOG':
      return {
        ...state,
        blogs: state.blogs.map(blog =>
          blog.id === action.payload.id
            ? { ...blog, ...action.payload.blog, updatedAt: new Date().toISOString() }
            : blog
        )
      };
    case 'DELETE_BLOG':
      return {
        ...state,
        blogs: state.blogs.filter(blog => blog.id !== action.payload)
      };
    case 'SET_CURRENT_BLOG':
      return { ...state, currentBlog: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(blogReducer, {
    blogs: [],
    currentBlog: null,
    isLoading: false
  });

  useEffect(() => {
    const storedBlogs = localStorage.getItem('blogs');
    if (storedBlogs) {
      dispatch({ type: 'SET_BLOGS', payload: JSON.parse(storedBlogs) });
    } else {
      // Initialize with some sample blogs
      const sampleBlogs: Blog[] = [
        {
          id: '1',
          title: 'The Future of Web Development',
          content: 'Progressive Web Apps are revolutionizing the way we think about web applications...',
          excerpt: 'Exploring the cutting-edge technologies shaping the future of web development.',
          heroImage: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=800',
          author: {
            id: 'sample',
            email: 'demo@example.com',
            username: 'Demo User',
            avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tags: ['Web Development', 'PWA', 'Technology']
        }
      ];
      dispatch({ type: 'SET_BLOGS', payload: sampleBlogs });
      localStorage.setItem('blogs', JSON.stringify(sampleBlogs));
    }
  }, []);

  const createBlog = (blogData: Omit<Blog, 'id' | 'author' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return;

    const newBlog: Blog = {
      ...blogData,
      id: Date.now().toString(),
      author: user,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    dispatch({ type: 'ADD_BLOG', payload: newBlog });
    
    const updatedBlogs = [newBlog, ...state.blogs];
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const updateBlog = (id: string, blogData: Partial<Blog>) => {
    dispatch({ type: 'UPDATE_BLOG', payload: { id, blog: blogData } });
    
    const updatedBlogs = state.blogs.map(blog =>
      blog.id === id
        ? { ...blog, ...blogData, updatedAt: new Date().toISOString() }
        : blog
    );
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const deleteBlog = (id: string) => {
    dispatch({ type: 'DELETE_BLOG', payload: id });
    
    const updatedBlogs = state.blogs.filter(blog => blog.id !== id);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const getBlog = (id: string) => {
    return state.blogs.find(blog => blog.id === id);
  };

  return (
    <BlogContext.Provider value={{
      ...state,
      createBlog,
      updateBlog,
      deleteBlog,
      getBlog
    }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (context === undefined) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};