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
import Dashboard from './pages/Dashboard';
import Matchmaking from './pages/Matchmaking';
import NotFound from './pages/NotFound';
import Horoscope from './pages/Horoscope';
import Panchang from './pages/Panchang';
import AuthPage from './pages/AuthPage';

// Blog Pages
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

// Define exclude paths (pages where you don't want auto-scroll)
const excludePaths = ['/kundli-result', '/kundli/result'];

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AuthProvider>
        <ScrollToTop excludePaths={excludePaths} />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="grow">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/kundli" element={<KundliForm />} />
              {/* Multiple paths for KundliResult to handle all cases */}
              <Route path="/kundli-result" element={<KundliResult />} />
              <Route path="/result" element={<KundliResult />} />
              <Route path="/kundli-result/:id" element={<KundliResult />} />
              <Route path="/report/:id" element={<KundliResult />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/matchmaking" element={<Matchmaking />} />
              <Route path="/login" element={<AuthPage />} />
              <Route path="/register" element={<AuthPage />} />
              <Route path="/horoscope" element={<Horoscope />} />
              <Route path="/panchang" element={<Panchang />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />

              {/* Protected Routes (require authentication) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>

              {/* Admin Routes (require admin role) */}
              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/orders" element={<AdminOrders />} />
              </Route>

              {/* 404 Not Found */}
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