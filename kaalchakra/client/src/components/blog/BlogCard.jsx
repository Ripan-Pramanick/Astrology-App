// client/src/components/blog/BlogCard.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Eye, Bookmark, Share2, TrendingUp, User } from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const BlogCard = ({ article, onBookmarkChange }) => {
  const { user } = useAuth();
  const { 
    id, 
    title, 
    excerpt, 
    image, 
    date, 
    readTime = '4 min read',
    category,
    views = 0,
    isPremium = false,
    author,
    slug
  } = article;

  const [isLoading, setIsLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(article.isBookmarked || false);
  const [showTooltip, setShowTooltip] = useState(false);

  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }) : 'Recent';

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      alert('Please login to save bookmarks');
      return;
    }
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      if (isBookmarked) {
        await api.delete(`/blog/bookmarks/${id}`);
        setIsBookmarked(false);
      } else {
        await api.post(`/blog/bookmarks/${id}`);
        setIsBookmarked(true);
      }
      
      setShowTooltip(true);
      setTimeout(() => setShowTooltip(false), 2000);
      
      if (onBookmarkChange) {
        onBookmarkChange(id, !isBookmarked);
      }
      
    } catch (error) {
      console.error('Bookmark error:', error);
      alert(error.response?.data?.message || 'Failed to save bookmark');
    } finally {
      setIsLoading(false);
    }
  };

  const handleShare = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/blog/${slug || id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: excerpt,
          url: url
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.log('Share cancelled:', error);
        }
      }
    } else {
      try {
        await navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      } catch (err) {
        console.error('Copy failed:', err);
      }
    }
  };

  return (
    <article className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative">
      {image && (
        <Link to={`/blog/${slug || id}`} className="block">
          <div className="h-48 overflow-hidden relative">
            <img
              src={image}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.target.src = 'https://placehold.co/600x400/1f2a44/white?text=Astrology+Article';
              }}
            />
            
            {category && (
              <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full shadow-md">
                {category}
              </span>
            )}
            
            {isPremium && (
              <span className="absolute top-3 right-3  text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md" style={{ backgroundImage: 'linear-gradient(to right, #eab308, #f59e0b)' }}>
                <TrendingUp size={12} /> Premium
              </span>
            )}
          </div>
        </Link>
      )}
      
      <div className="p-5">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Calendar size={12} />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={12} />
              <span>{readTime}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye size={12} />
              <span>{views.toLocaleString()}</span>
            </div>
          </div>
          
          {author && (
            <div className="flex items-center gap-1 text-gray-400">
              <User size={10} />
              <span className="text-xs">{author}</span>
            </div>
          )}
        </div>
        
        <Link to={`/blog/${slug || id}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-orange-500 transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {excerpt}
        </p>
        
        <div className="flex justify-between items-center">
          <Link to={`/blog/${slug || id}`}>
            <button className="px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-300 rounded-lg hover:bg-orange-50 transition-all duration-300">
              Read More →
            </button>
          </Link>
          
          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={handleBookmark}
                disabled={isLoading}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isBookmarked 
                    ? 'text-orange-500 bg-orange-50' 
                    : 'text-gray-400 hover:text-orange-500 hover:bg-orange-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                aria-label={isBookmarked ? 'Remove bookmark' : 'Save for later'}
              >
                <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              
              {showTooltip && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap">
                  {isBookmarked ? 'Saved to bookmarks!' : 'Bookmark removed'}
                </div>
              )}
            </div>
            
            <button
              onClick={handleShare}
              className="p-2 rounded-full text-gray-400 hover:text-orange-500 hover:bg-orange-50 transition-all duration-200"
              aria-label="Share article"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

// Loading Skeleton Component
const BlogCardSkeleton = () => (
  <article className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-12 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded mb-1 w-full"></div>
      <div className="h-4 bg-gray-200 rounded mb-1 w-5/6"></div>
      <div className="h-4 bg-gray-200 rounded mb-4 w-4/6"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 w-24 bg-gray-200 rounded"></div>
        <div className="flex gap-2">
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </article>
);

// Grid View for multiple cards
const BlogGrid = ({ articles, loading, onBookmarkChange }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }
  
  if (!articles || articles.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No articles found.</p>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <BlogCard 
          key={article.id} 
          article={article} 
          onBookmarkChange={onBookmarkChange}
        />
      ))}
    </div>
  );
};

export { BlogCard, BlogGrid, BlogCardSkeleton };
export default BlogCard;