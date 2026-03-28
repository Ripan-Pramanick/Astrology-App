// client/src/pages/Blog.jsx
import React from 'react';
import BlogCard from '../components/blog/BlogCard';
import { articles } from '../data/mockData';

const Blog = () => {
  // Enhanced mock articles with additional fields
  const blogPosts = articles.map(article => ({
    ...article,
    readTime: '4 min read',
    image: article.image || '/placeholder-blog.jpg',
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Astrology Insights</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Explore articles, predictions, and wisdom from the cosmic realm.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map(article => (
          <BlogCard key={article.id} article={article} />
        ))}
      </div>

      {/* Optional: Pagination or load more */}
      <div className="text-center mt-12">
        <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
          Load More Articles
        </button>
      </div>
    </div>
  );
};

export default Blog;