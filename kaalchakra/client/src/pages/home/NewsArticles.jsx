import React, { useState, useEffect } from 'react';
import { Calendar, User, Clock, ChevronRight, BookOpen, TrendingUp, Sparkles, Tag, Loader2, AlertCircle } from 'lucide-react';
import api from '../services/api.js';

// Category colors mapping
const categoryColors = {
  "Festivals": "bg-orange-100 text-orange-700",
  "Astrology": "bg-purple-100 text-purple-700",
  "Remedies": "bg-emerald-100 text-emerald-700",
  "Muhurata": "bg-blue-100 text-blue-700",
  "Spirituality": "bg-indigo-100 text-indigo-700",
  "Career": "bg-green-100 text-green-700",
  "Relationships": "bg-pink-100 text-pink-700",
  "Education": "bg-yellow-100 text-yellow-700"
};

// Article Card Component
const ArticleCard = ({ article, index, onReadMore }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onReadMore(article.id)}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={article.image_url || article.image} 
          alt={article.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            e.target.src = 'https://placehold.co/800x400/1f2a44/white?text=Astrology+Article';
          }}
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
            {article.category}
          </span>
        </div>
        {/* Trending Badge */}
        {article.is_trending && (
          <div className="absolute top-4 right-4">
            <span className="flex items-center gap-1 px-2 py-1 bg-red-500 text-white rounded-full text-xs font-semibold">
              <TrendingUp className="w-3 h-3" />
              Trending
            </span>
          </div>
        )}
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500 mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.read_time || `${Math.ceil((article.content?.length || 1000) / 1000)} min read`}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{article.author_name || article.author}</span>
          </div>
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-3 leading-tight line-clamp-2 group-hover:text-orange-600 transition-colors">
          {article.title}
        </h3>
        
        {/* Excerpt */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {article.excerpt}
        </p>
        
        {/* Read More Link */}
        <button className="group/btn inline-flex items-center gap-2 text-orange-500 font-medium text-sm hover:text-orange-600 transition-colors">
          <span>Read Article</span>
          <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};

// Loading Skeleton
const ArticleCardSkeleton = () => (
  <div className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
    <div className="h-52 bg-gray-200"></div>
    <div className="p-6">
      <div className="flex flex-wrap items-center gap-4 mb-3">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-24"></div>
    </div>
  </div>
);

// Featured Article Component
const FeaturedArticle = ({ article, onReadMore }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onReadMore(article.id)}
    >
      <div className="absolute inset-0 bg-black/20 z-10"></div>
      <div className="relative z-20 p-8 md:p-10 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-yellow-300" />
            <span className="text-sm font-semibold text-yellow-200">Featured Article</span>
          </div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 leading-tight">
            {article.title}
          </h2>
          <p className="text-orange-100 text-base md:text-lg mb-6 line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-orange-200 mb-6">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" /> {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {article.read_time || `${Math.ceil((article.content?.length || 1000) / 1000)} min read`}
            </span>
          </div>
          <button className="inline-flex items-center gap-2 bg-white text-orange-600 font-semibold px-6 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            Read Featured Story
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={article.image_url || article.image} 
          alt={article.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          onError={(e) => {
            e.target.src = 'https://placehold.co/1200x600/1f2a44/white?text=Featured+Article';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-orange-600/60"></div>
      </div>
    </div>
  );
};

const NewsArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeSuccess, setSubscribeSuccess] = useState(false);
  
  const categories = ['all', 'Astrology', 'Festivals', 'Remedies', 'Muhurata', 'Spirituality', 'Career', 'Relationships'];
  
  useEffect(() => {
    fetchArticles();
  }, [activeFilter]);
  
  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const params = activeFilter !== 'all' ? { category: activeFilter } : {};
      const response = await api.get('/articles', { params });
      
      if (response.data.success) {
        setArticles(response.data.articles);
      } else {
        setError('Failed to load articles');
      }
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Unable to connect to server. Please try again later.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleReadMore = (articleId) => {
    window.location.href = `/blog/${articleId}`;
  };
  
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!subscribeEmail || !subscribeEmail.includes('@')) {
      alert('Please enter a valid email address');
      return;
    }
    
    setSubscribing(true);
    try {
      const response = await api.post('/newsletter/subscribe', { email: subscribeEmail });
      if (response.data.success) {
        setSubscribeSuccess(true);
        setSubscribeEmail('');
        setTimeout(() => setSubscribeSuccess(false), 5000);
      }
    } catch (err) {
      console.error('Subscription error:', err);
      alert('Failed to subscribe. Please try again.');
    } finally {
      setSubscribing(false);
    }
  };
  
  const featuredArticle = articles.find(a => a.is_featured) || articles[0];
  const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);
  
  if (loading) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-64 mx-auto mb-3 animate-pulse"></div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-16 h-px bg-gray-200"></div>
              <div className="w-6 h-6 bg-gray-200 rounded-full"></div>
              <div className="w-16 h-px bg-gray-200"></div>
            </div>
            <div className="h-5 bg-gray-200 rounded w-96 mx-auto animate-pulse"></div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-8 w-20 bg-gray-200 rounded-full animate-pulse"></div>
            ))}
          </div>
          
          <div className="mb-12">
            <div className="h-[300px] bg-gray-200 rounded-2xl animate-pulse"></div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <ArticleCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchArticles} 
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-orange-500" />
            </div>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3">
            News & Articles
          </h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-orange-300"></div>
            <span className="text-orange-400 text-xl">✨</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-orange-300"></div>
          </div>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Insights from our astrologers to guide you on your spiritual journey
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category === 'all' ? 'All Articles' : category}
            </button>
          ))}
        </div>

        {/* Featured Article (only show on 'all' filter and if there are articles) */}
        {activeFilter === 'all' && featuredArticle && (
          <div className="mb-12">
            <FeaturedArticle article={featuredArticle} onReadMore={handleReadMore} />
          </div>
        )}

        {/* Articles Grid */}
        {regularArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularArticles.map((article, index) => (
              <ArticleCard 
                key={article.id} 
                article={article} 
                index={index} 
                onReadMore={handleReadMore}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No articles found in this category.</p>
          </div>
        )}

        {/* View All Button */}
        {activeFilter !== 'all' && articles.length > 0 && (
          <div className="text-center mt-12">
            <button 
              onClick={() => setActiveFilter('all')}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <span>View All Articles</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 text-center border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay Updated with Cosmic Wisdom</h3>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter for monthly astrological insights and articles</p>
          
          {subscribeSuccess ? (
            <div className="bg-green-100 text-green-700 p-4 rounded-xl max-w-md mx-auto">
              ✅ Thanks for subscribing! Check your email for confirmation.
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                value={subscribeEmail}
                onChange={(e) => setSubscribeEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
                required
              />
              <button 
                type="submit"
                disabled={subscribing}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap disabled:opacity-50"
              >
                {subscribing ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Subscribe'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsArticles;