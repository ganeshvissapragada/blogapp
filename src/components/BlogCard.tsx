import React, { useState } from 'react';
import { Calendar, User, Edit, Trash2, Eye } from 'lucide-react';
import { Blog } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useBlog } from '../contexts/BlogContext';
import BlogEditor from './BlogEditor';
import BlogView from './BlogView';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const { user } = useAuth();
  const { deleteBlog } = useBlog();
  const [showEditor, setShowEditor] = useState(false);
  const [showView, setShowView] = useState(false);

  const isAuthor = user?.id === blog.author.id;

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      deleteBlog(blog.id);
    }
  };

  return (
    <>
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden hover:bg-white/10 transition-all duration-300 group hover:scale-[1.02]">
        {/* Hero Image */}
        {blog.heroImage && (
          <div className="relative h-48 overflow-hidden">
            <img
              src={blog.heroImage}
              alt={blog.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        )}

        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {blog.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full border border-indigo-500/30"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-indigo-300 transition-colors duration-200">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-300 mb-4 line-clamp-3">
            {blog.excerpt}
          </p>

          {/* Author and Date */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {blog.author.avatar && (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.username}
                  className="w-8 h-8 rounded-full border-2 border-white/20"
                />
              )}
              <div>
                <p className="text-white text-sm font-medium">{blog.author.username}</p>
                <div className="flex items-center text-gray-400 text-xs space-x-2">
                  <Calendar size={12} />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowView(true)}
              className="flex items-center space-x-1 px-3 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-all duration-200 text-sm"
            >
              <Eye size={16} />
              <span>Read</span>
            </button>

            {isAuthor && (
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowEditor(true)}
                  className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                  title="Edit"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEditor && (
        <BlogEditor
          blog={blog}
          onClose={() => setShowEditor(false)}
          onSave={() => setShowEditor(false)}
        />
      )}
      
      {showView && (
        <BlogView
          blog={blog}
          onClose={() => setShowView(false)}
        />
      )}
    </>
  );
};

export default BlogCard;