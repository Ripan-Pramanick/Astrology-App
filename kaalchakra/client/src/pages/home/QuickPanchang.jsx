import React from 'react';
import { Link } from 'react-router-dom';
import { panchang } from '../../data/mockData';

const TimeCard = ({ title, time, icon, bgColor }) => (
  <div className={`${bgColor} rounded-2xl p-5 flex flex-col items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300`}>
    <div className="text-white w-10 h-10 mb-3">{icon}</div>
    <p className="text-white text-sm font-medium uppercase tracking-wide">{title}</p>
    <p className="text-white text-xl font-bold mt-1">{time}</p>
  </div>
);

// SVGs (You can also move these to a separate icons file if you want)
const SunriseIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M4 18H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M6 14L12 8L18 14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 4V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M4.5 12.5L6 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M19.5 12.5L18 11" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 21V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 18H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const SunsetIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M4 18H20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M6 10L12 16L18 10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M12 6V8" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M4.5 8.5L6 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M19.5 8.5L18 7" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 21V19" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 18H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const MoonriseIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M12 3V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 9V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M5 15L12 21L19 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 18L18 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 18L6 20" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="8" r="3" stroke="white" strokeWidth="1.5" /><path d="M4 15C4 11.6863 6.68629 9 10 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 15C20 11.6863 17.3137 9 14 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 8V6" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;
const MoonsetIcon = () => <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full"><path d="M12 21V18" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 15V12" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M5 9L12 3L19 9" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M16 6L18 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M8 6L6 4" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><circle cx="12" cy="16" r="3" stroke="white" strokeWidth="1.5" /><path d="M4 9C4 12.3137 6.68629 15 10 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M20 9C20 12.3137 17.3137 15 14 15" stroke="white" strokeWidth="1.5" strokeLinecap="round" /><path d="M12 16V14" stroke="white" strokeWidth="1.5" strokeLinecap="round" /></svg>;


const QuickPanchang = () => {
  return (
    <div className="bg-gray-50 py-12 px-4 md:px-6 font-sans antialiased">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 tracking-tight">Aaj Ka Panchang</h1>
            <p className="text-gray-500 text-base mt-1">Santipur, West Bengal</p>
          </div>
          <Link to="/panchang">
            <button className="bg-[#F7931E] hover:bg-[#e6840c] transition-colors text-white font-semibold px-6 py-2.5 rounded-full shadow-md text-sm tracking-wide">
              Detailed Panchang
            </button>
          </Link>
        </div>

        <div className="flex items-center justify-center my-6">
          <div className="flex-grow h-px bg-gray-300"></div>
          <div className="px-6">
            <p className="text-gray-700 font-medium text-base">{panchang.date || "Wednesday, 9 October 2024"}</p>
          </div>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          <TimeCard title="Sunrise" time="6:18:31" icon={<SunriseIcon />} bgColor="bg-[#F7931E]" />
          <TimeCard title="Sunset" time="17:57:43" icon={<SunsetIcon />} bgColor="bg-[#F7931E]" />
          <TimeCard title="Moonrise" time="12:10:28" icon={<MoonriseIcon />} bgColor="bg-[#2C3E8F]" />
          <TimeCard title="Moonset" time="22:13:7" icon={<MoonsetIcon />} bgColor="bg-[#2C3E8F]" />
        </div>

        <div className="w-full h-px bg-[#F7931E] opacity-60 my-4"></div>

        <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Month</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Amanta</span><span className="text-gray-800 font-medium">Ashwin</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Purnimanta</span><span className="text-gray-800 font-medium">Ashwin</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Tithi</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center"><span className="text-gray-800 font-semibold">{panchang.tithi || "Shukla Shashthi"}</span><span className="text-gray-500 text-sm">Till: 2024-10-09 12:15:55</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Yog</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center"><span className="text-gray-800 font-semibold">{panchang.yoga || "Shobhan"}</span><span className="text-gray-500 text-sm">Till: 2024-10-10 05:53:23</span></div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Samvat</h3>
                <div className="bg-gray-50 rounded-lg p-3 space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Vikram</span><span className="text-gray-800 font-medium">2081 Peengal</span></div>
                  <div className="flex justify-between"><span className="text-gray-500 text-sm">Shaka</span><span className="text-gray-800 font-medium">1946 Krodhi</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nakshatra</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center"><span className="text-gray-800 font-semibold">{panchang.nakshatra || "Mool"}</span><span className="text-gray-500 text-sm">Till: 2024-10-10 05:15:08</span></div>
                </div>
              </div>
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Karan</h3>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="flex justify-between items-center"><span className="text-gray-800 font-semibold">Taitil</span><span className="text-gray-500 text-sm">Purnimanta: 2024-10-09 12:12:55</span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuickPanchang;