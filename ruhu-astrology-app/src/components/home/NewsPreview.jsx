import React from 'react';
import Card from '../common/Card';

const NewsPreview = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary mb-6">News & Articles</h2>
      <Card>
        <h3 className="font-semibold text-accent mb-2">What's the news?</h3>
        <p className="text-sm text-gray-600 mb-2">Did COVID-19 cause a pandemic?</p>
        <p className="text-sm text-gray-600">How many people have died from COVID-19?</p>
      </Card>
      <Card className="mt-4">
        <h3 className="font-semibold text-accent mb-2">What's the news?</h3>
        <p className="text-sm text-gray-600 mb-2">What's the latest on COVID-19?</p>
        <p className="text-sm text-gray-600">What's the latest on the vaccine rollout?</p>
      </Card>
    </div>
  );
};

export default NewsPreview;