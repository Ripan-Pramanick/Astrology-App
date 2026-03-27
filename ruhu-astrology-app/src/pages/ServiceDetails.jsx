import React from 'react';
import { useParams } from 'react-router-dom';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

const ServiceDetails = () => {
  const { id } = useParams();

  return (
    <div>
      <PageHeader title="Service Details" breadcrumb="Services" />
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center mb-6">
              <span className="text-gray-500">Service Image Placeholder</span>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-4">Every Problem Have A Solution</h2>
            <p className="text-gray-700 mb-4">
              We will provide the charges after reviewing the nature of your query & study required.
              An upfront token payment will be deducted from the total charges.
              Kindly proceed to submit your query.
            </p>
          </div>

          <div>
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-bold text-primary mb-6">Submit your query</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Name</label>
                  <input
                    type="text"
                    placeholder="Your name here"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="Your phone no. here"
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Gender</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="male" className="mr-2" /> Male
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="gender" value="female" className="mr-2" /> Female
                    </label>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2">Date</label>
                    <input type="date" className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2">Time</label>
                    <input type="time" className="w-full px-4 py-2 border rounded-lg" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Place</label>
                  <input
                    type="text"
                    placeholder="Start typing & choose from list"
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Comment</label>
                  <textarea
                    rows="4"
                    placeholder="Type message"
                    className="w-full px-4 py-2 border rounded-lg"
                  ></textarea>
                </div>
                <div className="text-center">
                  <Button variant="primary" className="w-full">
                    Rs.1560 FREE
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetails;