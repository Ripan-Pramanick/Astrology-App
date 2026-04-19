// client/src/pages/BlogDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, Clock, Eye, Heart, Share2, Bookmark, ArrowLeft, Tag, Sparkles } from 'lucide-react';
import api from '../services/api';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [relatedPosts, setRelatedPosts] = useState([]);

  useEffect(() => {
    fetchPost();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchPost = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const response = await api.get(`/articles/${id}`);
      if (response.data.success) {
        setPost(response.data.article);
        // Fetch related posts
        const relatedResponse = await api.get('/articles', { 
          params: { category: response.data.article.category, limit: 3 }
        });
        if (relatedResponse.data.success) {
          setRelatedPosts(relatedResponse.data.articles.filter(a => a.id !== parseInt(id)));
        }
      }
    } catch (error) {
      console.error('Error fetching post:', error);
      // Fallback to mock data
      setPost({
        id: parseInt(id),
        title: "The Significance of Maha Shivaratri: A Night of Awakening",
        excerpt: "Discover the spiritual importance of Maha Shivaratri and how this sacred night can transform your spiritual journey.",
        content: `
          <h2>What is Maha Shivaratri?</h2>
          <p>Maha Shivaratri is one of the most significant festivals in Hinduism, dedicated to Lord Shiva. It is celebrated on the 13th night and 14th day of the Phalguna month (February-March).</p>
          
          <h2>Spiritual Significance</h2>
          <p>This sacred night represents the convergence of Shiva and Shakti. It is believed that on this night, Lord Shiva performed the Tandava, the cosmic dance of creation, preservation, and destruction.</p>
          
          <h2>How to Observe</h2>
          <p>Devotees observe fast, perform Abhishekam (ritual bath) of the Shiva Linga with milk, water, honey, and bel leaves. Chanting Om Namah Shivaya and staying awake all night are important practices.</p>
          
          <h2>Benefits of Observing Maha Shivaratri</h2>
          <ul>
            <li>Removes negative karma and brings spiritual growth</li>
            <li>Brings peace, prosperity, and happiness</li>
            <li>Helps overcome fears and obstacles</li>
            <li>Strengthens devotion and spiritual connection</li>
          </ul>
        `,
        image: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?w=800",
        date: "March 15, 2024",
        readTime: "8 min read",
        author: "Dr. Suresh Rao",
        authorBio: "Dr. Suresh Rao is a renowned Vedic astrologer with over 25 years of experience. He specializes in Vedic astrology, KP system, and gemstone remedies.",
        category: "Festivals",
        views: 1250,
        tags: ["Shivaratri", "Festivals", "Spirituality"]
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Not Found</h2>
          <p className="text-gray-600 mb-4">The article you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/blog')} className="bg-orange-500 text-white px-6 py-2 rounded-lg">
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate('/blog')}
          className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-6"
        >
          <ArrowLeft size={20} /> Back to Blog
        </button>

        {/* Hero Image */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-8">
          <img src={post.image} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">{post.title}</h1>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-1"><Calendar size={16} />{post.date}</div>
          <div className="flex items-center gap-1"><Clock size={16} />{post.readTime}</div>
          <div className="flex items-center gap-1"><User size={16} />{post.author}</div>
          <div className="flex items-center gap-1"><Eye size={16} />{post.views} views</div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-200">
            <span className="text-gray-500 font-medium">Tags:</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        )}

        {/* Author Section */}
        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
              {post.author?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">About {post.author}</h3>
              <p className="text-gray-600 text-sm mt-1">{post.authorBio || "Expert Vedic astrologer with deep knowledge of planetary influences and remedies."}</p>
            </div>
          </div>
        </div>

        {/* Share Section */}
        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-3">Share this article</p>
          <div className="flex justify-center gap-3">
            <button className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z"/></svg>
            </button>
            <button className="p-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z"/></svg>
            </button>
            <button className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default BlogDetails;