import React from 'react';
import PageHeader from '../components/common/PageHeader';
import Button from '../components/common/Button';

const Kundli = () => {
  return (
    <div>
      <PageHeader title="Kundli" breadcrumb="Services" />
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary">Fill the form to get your kundali</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          <div>
            <div className="bg-gray-300 rounded-xl h-96 flex items-center justify-center">
              <span className="text-gray-500">Kundali Image Placeholder</span>
            </div>
          </div>

          <div>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
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
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
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

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Date</label>
                  <input type="text" placeholder="DD" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">MM</label>
                  <input type="text" placeholder="MM" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">YYYY</label>
                  <input type="text" placeholder="YYYY" className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Time</label>
                  <input type="text" placeholder="HH" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">MM</label>
                  <input type="text" placeholder="MM" className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">AM/PM</label>
                  <select className="w-full px-4 py-2 border rounded-lg">
                    <option>AM</option>
                    <option>PM</option>
                  </select>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Longitude</label>
                  <input type="text" placeholder="Degrees Min. Sec." className="w-full px-4 py-2 border rounded-lg" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Latitude</label>
                  <input type="text" placeholder="Degrees Min. Sec." className="w-full px-4 py-2 border rounded-lg" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Comment</label>
                <textarea
                  rows="3"
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
  );
};

export default Kundli;