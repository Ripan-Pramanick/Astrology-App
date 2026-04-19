// client/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';
import AdminRoute from './routes/AdminRoute';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import KundliForm from './pages/KundliForm';
import KundliResult from './pages/KundliResult';
import Contact from './pages/Contact';
// import Login from './pages/Login';
import OTPVerify from './pages/OTPVerify';
import Dashboard from './pages/Dashboard';
import Matchmaking from './pages/Matchmaking';
import NotFound from './pages/NotFound'; // Ensure this file exists
// import Register from './pages/Register';
import Orders from './pages/admin/Orders';
import ViewReport from './pages/ViewReport';
import Horoscope from './pages/Horoscope';
import Panchang from './pages/Panchang';
import AuthPage from './pages/AuthPage';


// Blog Pages (Make sure these files exist in your pages folder)
import Blog from './pages/Blog';
import BlogDetails from './pages/BlogDetails';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ScrollToTop from './components/common/ScrollToTop';

function App() {
  return (
    <Router>
      <ScrollToTop excludePaths={excludePaths} />
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/kundli" element={<KundliForm />} />
              <Route path="/kundli-result" element={<KundliResult />} />
              <Route path="/kundli-result/:id" element={<KundliResult />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/matchmaking" element={<Matchmaking />} />
              {/* <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} /> */}
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/verify-otp" element={<OTPVerify />} />
              <Route path="/report/:id" element={<ViewReport />} />
              <Route path="/match-making" element={<Matchmaking />} />
              <Route path="/horoscope" element={<Horoscope />} />
              <Route path="/panchang" element={<Panchang />} />
              <Route path="/admin/orders" element={<Orders />} />

              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />

              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin routes */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/orders" element={<AdminOrders />} /> {/* 👈 নতুন রুট */}
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;