import React, { useState } from 'react';
import { Calendar, User, Clock, ChevronRight, BookOpen, TrendingUp, Sparkles, Tag } from 'lucide-react';

// Sample articles data (replace with your actual import)
const articles = [
  {
    id: 1,
    title: "The Significance of Maha Shivaratri: A Night of Awakening",
    excerpt: "Discover the spiritual importance of Maha Shivaratri and how this sacred night can transform your spiritual journey through meditation and devotion.",
    date: "March 15, 2024",
    readTime: "8 min read",
    author: "Dr. Suresh Rao",
    category: "Festivals",
    image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800&h=400&fit=crop",
    trending: true
  },
  {
    id: 2,
    title: "Understanding Your Birth Chart: A Beginner's Guide to Vedic Astrology",
    excerpt: "Learn the basics of Vedic astrology and how to interpret your birth chart. A comprehensive guide to the 12 houses and 9 planets.",
    date: "March 10, 2024",
    readTime: "12 min read",
    author: "Pt. Rajesh Sharma",
    category: "Astrology",
    image: "https://images.unsplash.com/photo-1535378917042-10a22c95931a?w=800&h=400&fit=crop",
    trending: false
  },
  {
    id: 3,
    title: "The Healing Power of Gemstones: Vedic Remedies for Planetary Balance",
    excerpt: "Explore how different gemstones can help balance planetary influences and bring harmony to your life. Expert insights on gemstone therapy.",
    date: "March 5, 2024",
    readTime: "6 min read",
    author: "Ms. Geeta M",
    category: "Remedies",
    image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&h=400&fit=crop",
    trending: true
  },
  {
    id: 4,
    title: "Muhurata: The Science of Auspicious Timing for Success",
    excerpt: "Learn how to choose the perfect timing for important life events like marriage, business launch, and travel using Vedic muhurata principles.",
    date: "February 28, 2024",
    readTime: "10 min read",
    author: "Dr. Suresh Rao",
    category: "Muhurata",
    image: "https://images.unsplash.com/photo-1501139083538-0139583c060f?w=800&h=400&fit=crop",
    trending: false
  }
];

// Category colors mapping
const categoryColors = {
  "Festivals": "bg-orange-100 text-orange-700",
  "Astrology": "bg-purple-100 text-purple-700",
  "Remedies": "bg-emerald-100 text-emerald-700",
  "Muhurata": "bg-blue-100 text-blue-700"
};

// Article Card Component
const ArticleCard = ({ article, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 hover:-translate-y-2"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-52 overflow-hidden">
        <img 
          src={article.image} 
          alt={article.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${categoryColors[article.category] || 'bg-gray-100 text-gray-700'}`}>
            {article.category}
          </span>
        </div>
        {/* Trending Badge */}
        {article.trending && (
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
            <span>{article.date}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{article.readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="w-3.5 h-3.5" />
            <span>{article.author}</span>
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

// Featured Article Component (for the first/largest article)
const FeaturedArticle = ({ article }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="group relative bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
              <Calendar className="w-4 h-4" /> {article.date}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" /> {article.readTime}
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
          src={article.image} 
          alt={article.title}
          className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-orange-900/80 to-orange-600/60"></div>
      </div>
    </div>
  );
};

const NewsArticles = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const categories = ['all', 'Astrology', 'Festivals', 'Remedies', 'Muhurata'];
  
  const filteredArticles = activeFilter === 'all' 
    ? articles 
    : articles.filter(article => article.category === activeFilter);
  
  const featuredArticle = articles[0];
  const regularArticles = filteredArticles.filter(article => article.id !== featuredArticle.id);

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

        {/* Featured Article (only show on 'all' filter) */}
        {activeFilter === 'all' && (
          <div className="mb-12">
            <FeaturedArticle article={featuredArticle} />
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularArticles.map((article, index) => (
            <ArticleCard key={article.id} article={article} index={index} />
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold px-8 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
            <span>View All Articles</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Newsletter Subscription */}
        <div className="mt-16 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-8 text-center border border-orange-100">
          <h3 className="text-2xl font-bold text-gray-800 mb-2">Stay Updated with Cosmic Wisdom</h3>
          <p className="text-gray-600 mb-6">Subscribe to our newsletter for monthly astrological insights and articles</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-200 outline-none transition-all"
            />
            <button className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsArticles;