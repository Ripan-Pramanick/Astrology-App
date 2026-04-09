import React from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';

const blogs = [
  {
    id: 1,
    title: 'A Few Words About This Blog Platform, Ghost, And How This Site Was Made',
    author: 'MIKA MATIKAINEN',
    date: 'Apr 15, 2020',
    readTime: '4 min read',
    excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu velit tempus erat egestas efficitur. In hac habitasse platea dictumst.'
  },
  {
    id: 2,
    title: 'Understanding Your Kundali: A Beginner\'s Guide',
    author: 'John Doe',
    date: 'Mar 10, 2020',
    readTime: '6 min read',
    excerpt: 'Learn the basics of Vedic astrology and how to read your birth chart.'
  },
  {
    id: 3,
    title: 'The Power of Mantras in Daily Life',
    author: 'Jane Smith',
    date: 'Feb 20, 2020',
    readTime: '5 min read',
    excerpt: 'Discover how chanting mantras can transform your spiritual practice.'
  },
];

const BlogList = () => {
  return (
    <div>
      <PageHeader title="Blog" breadcrumb="Blog" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <Card key={blog.id} hover={true}>
              <div className="bg-gray-300 h-48 rounded-lg mb-4 flex items-center justify-center">
                <span className="text-gray-500">Blog Image</span>
              </div>
              <h3 className="text-xl font-bold text-primary mb-2 line-clamp-2">
                {blog.title}
              </h3>
              <div className="text-sm text-gray-500 mb-3">
                {blog.author} - {blog.date} · {blog.readTime}
              </div>
              <p className="text-gray-600 mb-4 line-clamp-3">{blog.excerpt}</p>
              <Link
                to={`/blog/${blog.id}`}
                className="text-accent hover:text-orange-600 font-semibold"
              >
                Read More →
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BlogList;