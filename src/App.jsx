import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Context
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ErrorBoundary from './components/common/ErrorBoundary';
import PrivateRoute from './components/common/PrivateRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Booking from './pages/Booking';
import BookingConfirmation from './pages/BookingConfirmation';
import CustomerPortal from './pages/CustomerPortal';
import Dashboard from './pages/Dashboard';
import AppointmentHistory from './pages/AppointmentHistory';
import PaymentHistory from './pages/PaymentHistory';
import ProfileSettings from './pages/ProfileSettings';
import ReferralSection from './pages/ReferralSection';
import AdminPanel from './pages/AdminPanel';
import AdminDashboard from './pages/AdminDashboard';
import AppointmentCalendar from './pages/AppointmentCalendar';
import CustomerManagement from './pages/CustomerManagement';
import Settings from './pages/Settings';

function App() {
  return (
    <ErrorBoundary showSupport={true}>
      <Router>
          <AuthProvider>
            <div className="flex flex-col min-h-screen">
              {/* Skip to main content link for accessibility */}
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-6 focus:py-3 focus:bg-primary-600 focus:text-white focus:font-semibold focus:rounded-xl focus:shadow-2xl focus:ring-4 focus:ring-primary-300 focus:ring-offset-2 transition-all duration-200"
              >
                Skip to main content
              </a>
              <Navbar />
              <main id="main-content" className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/booking" element={<PrivateRoute><Booking /></PrivateRoute>} />
                  <Route path="/booking-confirmation" element={<PrivateRoute><BookingConfirmation /></PrivateRoute>} />

                  {/* Customer Portal with nested routes */}
                  <Route path="/portal" element={<PrivateRoute><CustomerPortal /></PrivateRoute>}>
                    <Route index element={<Dashboard />} />
                    <Route path="appointments" element={<AppointmentHistory />} />
                    <Route path="payments" element={<PaymentHistory />} />
                    <Route path="profile" element={<ProfileSettings />} />
                    <Route path="referrals" element={<ReferralSection />} />
                  </Route>

                  {/* Admin Panel with nested routes */}
                  <Route path="/admin" element={<PrivateRoute adminOnly={true}><AdminPanel /></PrivateRoute>}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="appointments" element={<AppointmentCalendar />} />
                    <Route path="customers" element={<CustomerManagement />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster position="top-right" />
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
