import React from 'react';
// সাধারণ আইকন lucide-react থেকে
import { Phone, Mail } from 'lucide-react';
// সোশ্যাল আইকন react-icons থেকে
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const TopBar = () => {
  return (
    <div className="bg-primary text-white py-2 px-4 hidden md:block">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Phone size={16} />
            <span className="text-sm">+000 123 456789</span>
          </div>
          <div className="flex items-center space-x-2">
            <Mail size={16} />
            <span className="text-sm">info@example.com</span>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Follow us on</span>
          {/* এখানে react-icons এর কম্পোনেন্টগুলো বসানো হয়েছে */}
          <FaFacebook size={16} className="cursor-pointer hover:text-accent transition" />
          <FaInstagram size={16} className="cursor-pointer hover:text-accent transition" />
          <FaTwitter size={16} className="cursor-pointer hover:text-accent transition" />
        </div>
      </div>
    </div>
  );
};

export default TopBar;