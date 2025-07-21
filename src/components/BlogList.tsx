import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useBlog } from '../contexts/BlogContext';
import { useAuth } from '../contexts/AuthContext';
import BlogCard from './BlogCard';
import BlogEditor from './BlogEditor';

interface BlogListProps {
  filterByUser?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({ filterByUser = false }) => {
  const { blogs } = useBlog();
  const { isAuthenticated, user } = useAuth();
  const [showEditor, setShowEditor] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  const allTags = Array.from(new Set(blogs.flatMap(blog => blog.tags)));
  
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         blog.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || blog.tags.includes(selectedTag);
    const matchesUser = !filterByUser || (user && blog.author.id === user.id);
    return matchesSearch && matchesTag && matchesUser;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              {filterByUser ? 'My Blog Posts' : 'Discover Amazing Stories'}
            </h1>
            <p className="text-gray-300">
              {filterByUser
                ? `You have ${filteredBlogs.length} blog posts`
                : `Explore ${blogs.length} inspiring blog posts from our community`}
            </p>
          </div>
          
          {isAuthenticated && (
            <button
              onClick={() => setShowEditor(true)}
              className="mt-4 md:mt-0 flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              <Plus size={20} />
              <span>New Post</span>
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            <option value="">All Tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag} className="bg-slate-800">
                {tag}
              </option>
            ))}
          </select>
        </div>

        {/* Blog Grid */}
        {filteredBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map(blog => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 max-w-md mx-auto">
              <h3 className="text-2xl font-semibold text-white mb-2">No blogs found</h3>
              <p className="text-gray-300 mb-6">
                {searchTerm || selectedTag 
                  ? "Try adjusting your search criteria"
                  : "Be the first to create a blog post!"
                }
              </p>
              {isAuthenticated && !searchTerm && !selectedTag && (
                <button
                  onClick={() => setShowEditor(true)}
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Blog Editor Modal */}
      {showEditor && (
        <BlogEditor
          onClose={() => setShowEditor(false)}
          onSave={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default BlogList;