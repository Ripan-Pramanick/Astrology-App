// client/src/components/blog/BlogCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';

const BlogCard = ({ article }) => {
  const { id, title, excerpt, image, date, readTime = '4 min read' } = article;

  return (
    <article className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {image && (
        <div className="h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-6">
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span>{date}</span>
          <span className="mx-2">•</span>
          <span>{readTime}</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <div className="flex justify-between items-center">
          <Link to={`/blog/${id}`}>
            <Button variant="outline" size="sm">
              Read More
            </Button>
          </Link>
          <span className="text-sm text-gray-400">✨ Premium Insight</span>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;