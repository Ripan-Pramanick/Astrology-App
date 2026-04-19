// import React from 'react';
// import { useParams, Link } from 'react-router-dom';
// import PageHeader from '../components/common/PageHeader.jsx';
// import Card from '../components/ui/Card.jsx';
// import { FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';

// // ১. স্ট্যাটিক ডেটা কম্পোনেন্টের বাইরে রাখা হলো (পারফরম্যান্স অপটিমাইজেশন)
// const recommended = [
//   { title: '500-Coconut Vel Povers & Day Muruga Powertime', desc: 'Join our brand "Day Invocation of Muruga..."' },
//   { title: '500-Coconut Vel Povers & Day Muruga Powertime', desc: 'Join our brand "Day Invocation of Muruga..."' },
//   { title: '500-Coconut Vel Povers & Day Muruga Powertime', desc: 'Join our brand "Day Invocation of Muruga..."' },
// ];

// const BlogDetails = () => {
//   const { id } = useParams();

//   return (
//     <div>
//       <PageHeader title="Blog Details" breadcrumb="Blog" />
//       <div className="container mx-auto px-4 py-12">
//         <div className="max-w-3xl mx-auto">
//           <h1 className="text-4xl font-bold text-primary mb-4">
//             A Few Words About This Blog Platform, Ghost, And How This Site Was Made
//           </h1>
//           <div className="flex items-center text-gray-500 mb-8">
//             <span>MIKA MATIKAINEN</span>
//             <span className="mx-2">•</span>
//             <span>Apr 15, 2020</span>
//             <span className="mx-2">•</span>
//             <span>4 min read</span>
//           </div>

//           <div className="bg-gray-300 h-96 rounded-xl mb-8 flex items-center justify-center">
//             <span className="text-gray-500">Blog Featured Image</span>
//           </div>

//           <div className="prose max-w-none">
//             <p className="text-gray-700 mb-4">
//               Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis eu velit tempus erat egestas efficitur.
//               In hac habitasse platea dictumst. Fusce a nunc eget ligula suscipit finibus. Aenean pharetra quis lacus at viverra.
//               Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
//               Aliquam quis posuere ligula. In eu dui molestie, molestie lectus eu, semper lectus.
//             </p>

//             <h2 className="text-2xl font-bold text-primary mt-8 mb-4">Next on the pipeline</h2>
//             <p className="text-gray-700 mb-4">
//               Duis eu velit tempus erat egestas efficitur. In hac habitasse platea dictumst.
//               Fusce a nunc eget ligula suscipit finibus. Aenean pharetra quis lacus at viverra.
//             </p>

//             <div className="bg-gray-200 h-64 rounded-xl my-8 flex items-center justify-center">
//               <span className="text-gray-500">Image caption centered</span>
//             </div>

//             <h3 className="text-xl font-bold text-primary mt-8 mb-4">A list looks like this:</h3>
//             <ul className="list-disc pl-6 space-y-2 mb-6">
//               <li>First item in the list</li>
//               <li>Second item in the list</li>
//               <li>Third item in the list</li>
//             </ul>

//             <p className="text-gray-700 mb-8">
//               Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos.
//               Aliquam quis posuere ligula.
//             </p>

//             <div className="border-t pt-6 mt-8">
//               <div className="flex space-x-4 items-center">
//                 <span className="font-semibold">Share:</span>
//                 {/* ২. এসইও এবং সিকিউরিটির জন্য লিংক অপটিমাইজেশন */}
//                 <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" title="Facebook">
//                   <FaFacebook size={20} className="cursor-pointer hover:text-accent transition-colors" />
//                 </a>
//                 <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Share on Twitter" title="Twitter">
//                   <FaTwitter size={20} className="cursor-pointer hover:text-accent transition-colors" />
//                 </a>
//                 <a href="#" target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" title="LinkedIn">
//                   <FaLinkedin size={20} className="cursor-pointer hover:text-accent transition-colors" />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>

//         <div className="mt-16">
//           <h2 className="text-2xl font-bold text-primary mb-8">Recommended</h2>
//           <div className="grid md:grid-cols-3 gap-6">
//             {recommended.map((post, idx) => (
//               <Card key={idx}>
//                 <div className="bg-gray-300 h-40 rounded-lg mb-4"></div>
//                 <h3 className="font-bold text-primary mb-2">{post.title}</h3>
//                 <p className="text-sm text-gray-600">{post.desc}</p>
//                 <Link to="#" className="text-accent text-sm mt-2 inline-block">
//                   Read More →
//                 </Link>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BlogDetails;