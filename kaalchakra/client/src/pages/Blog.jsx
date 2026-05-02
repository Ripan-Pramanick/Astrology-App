// client/src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { BlogGrid } from '../components/blog/BlogCard';
import api from '../services/api';

const Blog = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['all', 'Education', 'Spirituality', 'Remedies', 'Career', 'Relationships'];

  useEffect(() => {
    fetchArticles();
  }, [category, page]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blog/posts', {
        params: { category: category !== 'all' ? category : undefined, page, limit: 9 }
      });
      
      if (response.data.success) {
        setArticles(response.data.posts);
        setTotalPages(response.data.totalPages);
      }
    } catch (error) {
      console.error('Failed to fetch articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmarkChange = (id, isBookmarked) => {
    setArticles(prev => prev.map(article => 
      article.id === id ? { ...article, isBookmarked } : article
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Astrology Blog</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover ancient wisdom, planetary insights, and practical guidance for modern life
          </p>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                category === cat
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>
        
        {/* Articles Grid */}
        <BlogGrid 
          articles={articles} 
          loading={loading} 
          onBookmarkChange={handleBookmarkChange}
        />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-600">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;