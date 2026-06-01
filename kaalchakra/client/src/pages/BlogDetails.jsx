// client/src/pages/BlogDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Calendar, User, Clock, Eye, Heart, Share2, Bookmark, ArrowLeft, Tag, Sparkles } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import api from '../services/api';

const BlogDetails = () => {
  const { t } = useTranslation('pages');
  // ... (state and fetch variables) ...

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('blog.loading')}</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('blog.notFound')}</h2>
          <p className="text-gray-600 mb-4">{t('blog.notFoundDesc')}</p>
          <button onClick={() => navigate('/blog')} className="bg-orange-500 text-white px-6 py-2 rounded-lg">
            {t('blog.backToBlog')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        
        <button onClick={() => navigate('/blog')} className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors mb-6">
          <ArrowLeft size={20} /> {t('blog.backToBlog')}
        </button>

        {/* ... (Image, Title, Info) ... */}
        
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-1"><Calendar size={16} />{post.date}</div>
          <div className="flex items-center gap-1"><Clock size={16} />{post.readTime}</div>
          <div className="flex items-center gap-1"><User size={16} />{post.author}</div>
          <div className="flex items-center gap-1"><Eye size={16} />{post.views} {t('blog.views')}</div>
        </div>

        <div className="prose prose-lg max-w-none mb-8">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-200">
            <span className="text-gray-500 font-medium">{t('blog.tags')}</span>
            {post.tags.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">#{tag}</span>
            ))}
          </div>
        )}

        <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl p-6 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white text-2xl font-bold">
              {post.author?.charAt(0)}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">{t('blog.about')} {post.author}</h3>
              <p className="text-gray-600 text-sm mt-1">{post.authorBio}</p>
            </div>
          </div>
        </div>

        <div className="text-center py-6 border-t border-gray-200">
          <p className="text-gray-600 mb-3">{t('blog.share')}</p>
          {/* Social icons */}
        </div>
      </div>
    </div>
  );
};

export default BlogDetails;