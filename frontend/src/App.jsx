import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AvailableRoutes from './components/AvailableRoutes';
import SearchRoutes from './components/SearchRoutes';
import BookTicket from './components/BookTicket';
import MyBookings from './components/MyBookings';
import CancelBooking from './components/CancelBooking';
import SeatAvailability from './components/SeatAvailability';
import BookingReports from './components/BookingReports';
import Schedule from './components/Schedule';
import AdminDashboard from './components/AdminDashboard';
import AuthModal from './components/AuthModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import { 
  apiGetRoutes, 
  apiGetBookings, 
  apiBookTicket, 
  apiCancelBooking, 
  apiResetBookings 
} from './api';

function MainApp() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  // Real-time backend states
  const [routes, setRoutes] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedRouteId, setSelectedRouteId] = useState('');
  const [dataLoading, setDataLoading] = useState(true);

  // Fetch routes and bookings from backend
  const loadRoutesAndBookings = async () => {
    try {
      const [serverRoutes, serverBookings] = await Promise.all([
        apiGetRoutes().catch(() => []),
        apiGetBookings().catch(() => []),
      ]);

      if (serverRoutes && Array.isArray(serverRoutes)) {
        setRoutes(serverRoutes);
        if (serverRoutes.length > 0) {
          setSelectedRouteId((prev) => prev || serverRoutes[0].route_id);
        }
      }
      if (serverBookings && Array.isArray(serverBookings)) {
        setBookings(serverBookings);
      }
    } catch (err) {
      console.warn('Backend loading warning:', err);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    loadRoutesAndBookings();
  }, [user]);

  // Handle Ticket Booking (Authoritative Backend)
  const handleBookSuccess = async ({ passengerName, passengerAge, routeId, seats, totalFare }) => {
    const newBookingRecord = await apiBookTicket({
      passengerName,
      passengerAge,
      routeId,
      seats,
    });

    setBookings((prevBookings) => [newBookingRecord, ...prevBookings]);
    setRoutes((prevRoutes) =>
      prevRoutes.map((r) => {
        if (r.route_id === routeId) {
          return {
            ...r,
            available_seats: Math.max(0, r.available_seats - seats),
          };
        }
        return r;
      })
    );
    loadRoutesAndBookings();
    return newBookingRecord;
  };

  // Handle Booking Cancellation (Authoritative Backend)
  const handleCancelBooking = async (bookingId) => {
    const targetBooking = bookings.find((b) => b.booking_id === bookingId);
    if (!targetBooking || targetBooking.status === 'Cancelled') {
      return null;
    }

    await apiCancelBooking(bookingId);
    await loadRoutesAndBookings();
    return targetBooking;
  };

  // Handle Clear / Reset All Bookings (Admin only, Authoritative Backend)
  const handleResetBookings = async () => {
    await apiResetBookings();
    await loadRoutesAndBookings();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onOpenAuth={() => setShowAuthModal(true)} 
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        {/* ================================================================= */}
        {/* PUBLIC ACCESS GATE: If NOT logged in, show Landing Page only!    */}
        {/* ================================================================= */}
        {!user ? (
          <LandingPage 
            routes={routes} 
            onOpenAuth={() => setShowAuthModal(true)} 
          />
        ) : (
          /* =============================================================== */
          /* AUTHENTICATED ACCESS: Only logged-in users see the Dashboard     */
          /* =============================================================== */
          <div className="animate-in fade-in duration-150">
            {activeTab === 'dashboard' && (
              <Dashboard 
                routes={routes} 
                bookings={bookings} 
                setActiveTab={setActiveTab} 
                setSelectedRouteId={setSelectedRouteId} 
              />
            )}

            {activeTab === 'routes' && (
              <AvailableRoutes 
                routes={routes} 
                setActiveTab={setActiveTab} 
                setSelectedRouteId={setSelectedRouteId} 
              />
            )}

            {activeTab === 'search' && (
              <SearchRoutes 
                routes={routes} 
                setActiveTab={setActiveTab} 
                setSelectedRouteId={setSelectedRouteId} 
              />
            )}

            {activeTab === 'book' && (
              <BookTicket 
                routes={routes} 
                bookings={bookings} 
                onBookSuccess={handleBookSuccess} 
                selectedRouteId={selectedRouteId} 
                setSelectedRouteId={setSelectedRouteId}
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'my-bookings' && (
              <MyBookings 
                bookings={bookings} 
                routes={routes} 
                onCancelBooking={handleCancelBooking} 
                onResetBookings={isAdmin ? handleResetBookings : null}
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'cancel' && (
              <CancelBooking 
                bookings={bookings} 
                routes={routes} 
                onCancelBooking={handleCancelBooking} 
                setActiveTab={setActiveTab} 
              />
            )}

            {activeTab === 'availability' && (
              <SeatAvailability 
                routes={routes} 
                setActiveTab={setActiveTab} 
                setSelectedRouteId={setSelectedRouteId} 
              />
            )}

            {activeTab === 'reports' && (
              <BookingReports 
                routes={routes} 
                bookings={bookings} 
              />
            )}

            {activeTab === 'schedule' && (
              <Schedule 
                routes={routes} 
                setActiveTab={setActiveTab} 
                setSelectedRouteId={setSelectedRouteId} 
              />
            )}

            {activeTab === 'admin' && isAdmin && (
              <AdminDashboard 
                routes={routes} 
                setRoutes={setRoutes} 
                onRefreshRoutes={loadRoutesAndBookings} 
              />
            )}
          </div>
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
      />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-slate-800 font-heading">SmartBus Express</span>
            <span>•</span>
            <span>Smart Intercity Bus Reservation System</span>
          </div>
          <div>
            &copy; {new Date().getFullYear()} SmartBus Express. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
