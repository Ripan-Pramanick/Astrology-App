import React from 'react';
import Card from '../common/Card';

const posts = [
  { title: 'Every Problem Have A Solution', desc: 'Connect with like-minded people.' },
  { title: 'Every Problem Have A Solution', desc: 'Share your life stories.' },
  { title: 'Every Problem Have A Solution', desc: 'Share your life moments.' },
];

const SocialFeed = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">Social Media Feed</h2>
      <div className="space-y-4">
        {posts.map((post, idx) => (
          <Card key={idx}>
            <h3 className="font-semibold text-accent mb-2">{post.title}</h3>
            <p className="text-sm text-gray-600">{post.desc}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SocialFeed;