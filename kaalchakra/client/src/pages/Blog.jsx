// client/src/pages/Blog.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BlogGrid } from '../components/blog/BlogCard';
import api from '../services/api';

const Blog = () => {
  const { t } = useTranslation('pages');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = ['all', 'Education', 'Spirituality', 'Remedies', 'Career', 'Relationships'];

  // ... (useEffect and API functions) ...

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('blog.title')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('blog.subtitle')}</p>
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
              {t(`blog.categories.${cat}`, { defaultValue: cat })}
            </button>
          ))}
        </div>
        
        <BlogGrid articles={articles} loading={loading} onBookmarkChange={handleBookmarkChange} />
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="...">
              {t('blog.previous')}
            </button>
            <span className="px-4 py-2 text-gray-600">
              {t('blog.pageOf').replace('{{page}}', page).replace('{{totalPages}}', totalPages)}
            </span>
            <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="...">
              {t('blog.next')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;