import React from 'react';
import { X, Calendar, User, Tag } from 'lucide-react';
import { Blog } from '../types';

interface BlogViewProps {
  blog: Blog;
  onClose: () => void;
}

const BlogView: React.FC<BlogViewProps> = ({ blog, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-slate-800/90 backdrop-blur-xl rounded-2xl border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800/95 backdrop-blur-xl border-b border-white/10 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {blog.author.avatar && (
                <img
                  src={blog.author.avatar}
                  alt={blog.author.username}
                  className="w-12 h-12 rounded-full border-2 border-white/20"
                />
              )}
              <div>
                <p className="text-white font-medium">{blog.author.username}</p>
                <div className="flex items-center text-gray-400 text-sm space-x-2">
                  <Calendar size={14} />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Hero Image */}
          {blog.heroImage && (
            <div className="mb-8">
              <img
                src={blog.heroImage}
                alt={blog.title}
                className="w-full h-64 object-cover rounded-2xl"
              />
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl font-bold text-white mb-6">
            {blog.title}
          </h1>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map(tag => (
              <span
                key={tag}
                className="flex items-center space-x-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 text-sm rounded-full border border-indigo-500/30"
              >
                <Tag size={12} />
                <span>{tag}</span>
              </span>
            ))}
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="text-gray-200 leading-relaxed whitespace-pre-wrap">
              {blog.content}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <div className="flex items-center justify-between text-gray-400 text-sm">
              <div>
                Created: {new Date(blog.createdAt).toLocaleDateString()}
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div>
                  Updated: {new Date(blog.updatedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogView;