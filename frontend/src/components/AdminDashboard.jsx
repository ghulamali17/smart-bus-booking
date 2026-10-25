import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Users, 
  Bus, 
  Ticket, 
  Ban, 
  CheckCircle2, 
  XCircle, 
  Search, 
  X,
  RefreshCw,
  Clock,
  MapPin,
  AlertCircle
} from 'lucide-react';
import { 
  apiAdminAddRoute, 
  apiAdminUpdateRoute, 
  apiAdminDeleteRoute, 
  apiAdminGetBookings, 
  apiAdminGetStats, 
  apiAdminGetUsers,
  apiCancelBooking,
  apiResetBookings 
} from '../api';

export default function AdminDashboard({ routes, setRoutes, onRefreshRoutes }) {
  const [activeAdminTab, setActiveAdminTab] = useState('routes'); // 'routes', 'bookings', 'users'
  const [allBookings, setAllBookings] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Search in bookings
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');

  // Add Route Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newRoute, setNewRoute] = useState({
    route_id: '',
    departure_city: '',
    destination_city: '',
    departure_time: '08:00 AM',
    ticket_price: '',
    total_seats: '40',
  });

  // Edit Route Modal State
  const [editingRoute, setEditingRoute] = useState(null);

  // Load Admin Data
  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [fetchedBookings, fetchedStats, fetchedUsers] = await Promise.all([
        apiAdminGetBookings().catch(() => []),
        apiAdminGetStats().catch(() => null),
        apiAdminGetUsers().catch(() => []),
      ]);

      setAllBookings(fetchedBookings || []);
      setStats(fetchedStats);
      setUsersList(fetchedUsers || []);
      if (onRefreshRoutes) {
        onRefreshRoutes();
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch admin data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  // Handle Add Route
  const handleAddRoute = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const added = await apiAdminAddRoute({
        ...newRoute,
        ticket_price: Number(newRoute.ticket_price),
        total_seats: Number(newRoute.total_seats),
      });

      setRoutes((prev) => [...prev, added]);
      setSuccessMsg(`Route ${added.route_id} added successfully!`);
      setShowAddModal(false);
      setNewRoute({
        route_id: '',
        departure_city: '',
        destination_city: '',
        departure_time: '08:00 AM',
        ticket_price: '',
        total_seats: '40',
      });
      loadAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Edit Route
  const handleUpdateRoute = async (e) => {
    e.preventDefault();
    if (!editingRoute) return;
    setError(null);
    try {
      const updated = await apiAdminUpdateRoute(editingRoute.route_id, editingRoute);
      setRoutes((prev) => prev.map((r) => (r.route_id === updated.route_id ? updated : r)));
      setSuccessMsg(`Route ${updated.route_id} updated successfully!`);
      setEditingRoute(null);
      loadAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Delete Route
  const handleDeleteRoute = async (routeId) => {
    if (!window.confirm(`Are you sure you want to delete route ${routeId}? This action cannot be undone.`)) return;
    setError(null);
    try {
      await apiAdminDeleteRoute(routeId);
      setRoutes((prev) => prev.filter((r) => r.route_id !== routeId));
      setSuccessMsg(`Route ${routeId} deleted successfully.`);
      loadAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Admin Cancel Booking
  const handleAdminCancelBooking = async (bookingId) => {
    if (!window.confirm(`Are you sure you want to cancel booking ${bookingId}? Seats will be restored.`)) return;
    setError(null);
    try {
      await apiCancelBooking(bookingId);
      setSuccessMsg(`Booking ${bookingId} cancelled and seats restored.`);
      loadAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle Reset All Bookings
  const handleResetAll = async () => {
    if (!window.confirm('CRITICAL ACTION: Reset all bookings across the entire system? All seats will be restored.')) return;
    setError(null);
    try {
      await apiResetBookings();
      setSuccessMsg('All bookings have been cleared and route capacities restored.');
      loadAdminData();
    } catch (err) {
      setError(err.message);
    }
  };

  // Filter Bookings for Display
  const filteredBookings = allBookings.filter((b) => {
    const matchesStatus = bookingStatusFilter === 'ALL' || b.status === bookingStatusFilter;
    const term = bookingSearch.trim().toLowerCase();
    const matchesSearch = !term || (
      b.booking_id.toLowerCase().includes(term) ||
      b.passenger_name.toLowerCase().includes(term) ||
      b.route_id.toLowerCase().includes(term) ||
      (b.user_email && b.user_email.toLowerCase().includes(term))
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* 1. TOP ADMIN BANNER (Deep Navy + Amber Accents)                       */}
      {/* ===================================================================== */}
      <div className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white shadow-xl ring-1 ring-white/10 p-6 sm:p-8">
        {/* Ambient radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'radial-gradient(40rem 20rem at 90% -10%, rgba(99,102,241,.4), transparent 60%)',
          }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10 text-xs font-semibold backdrop-blur-md mb-3.5">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              <span>Administrator Command Center</span>
            </div>
            <h1 className="sb-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
              Fleet &amp; Reservation Operations
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100/80 mt-2 max-w-2xl leading-relaxed">
              Administrative management: configure coach routes, supervise passenger reservations, audit financial performance, and oversee registered passenger accounts.
            </p>
          </div>

          <div className="flex items-center space-x-3 self-start md:self-auto shrink-0">
            <button
              onClick={loadAdminData}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/10"
              title="Refresh admin records"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-indigo-950 text-xs font-bold shadow-md shadow-black/20 flex items-center space-x-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Route</span>
            </button>
          </div>
        </div>

        {/* Global Admin KPI Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-6 border-t border-white/10">
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Revenue</span>
            <span className="sb-display text-xl font-bold text-amber-300 mt-1 block">
              Rs. {(stats?.totalRevenue ?? 0).toLocaleString()}
            </span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
            <span className="sb-display text-xl font-bold text-white mt-1 block">
              {stats?.totalBookings ?? allBookings.length}
            </span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Routes</span>
            <span className="sb-display text-xl font-bold text-indigo-200 mt-1 block">
              {routes.length}
            </span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Users</span>
            <span className="sb-display text-xl font-bold text-emerald-300 mt-1 block">
              {stats?.totalUsers ?? usersList.length}
            </span>
          </div>
          <div className="p-3.5 bg-white/5 rounded-2xl border border-white/5 col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Fleet Occupancy</span>
            <span className="sb-display text-xl font-bold text-amber-200 mt-1 block">
              {stats?.occupancyRate ?? 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)}><X className="w-4 h-4 text-rose-500" /></button>
        </div>
      )}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)}><X className="w-4 h-4 text-emerald-500" /></button>
        </div>
      )}

      {/* Admin Tab Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div className="flex space-x-2 overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('routes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'routes'
                ? 'bg-indigo-950 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            Route Management ({routes.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('bookings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'bookings'
                ? 'bg-indigo-950 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All User Bookings ({allBookings.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('users')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeAdminTab === 'users'
                ? 'bg-indigo-950 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            User Accounts ({usersList.length})
          </button>
        </div>

        {activeAdminTab === 'bookings' && allBookings.length > 0 && (
          <button
            onClick={handleResetAll}
            className="px-3.5 py-2 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 text-xs font-bold flex items-center space-x-1.5 self-start sm:self-auto transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset All Bookings</span>
          </button>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 2. ROUTES MANAGEMENT VIEW                                             */}
      {/* ===================================================================== */}
      {activeAdminTab === 'routes' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="sb-display text-lg font-bold text-indigo-950">Bus Routes Catalog</h3>
              <p className="text-xs text-slate-500 mt-0.5">Edit fares, update timings, or add new destination routes to the fleet</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-950 text-white text-xs font-bold shadow-xs hover:bg-indigo-800 flex items-center space-x-1.5 self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Route</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">Route ID</th>
                  <th className="py-3.5 px-5">Departure Hub</th>
                  <th className="py-3.5 px-5">Destination Hub</th>
                  <th className="py-3.5 px-5">Time</th>
                  <th className="py-3.5 px-5">Ticket Fare</th>
                  <th className="py-3.5 px-5">Capacity (Free / Total)</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {routes.map((r) => (
                  <tr key={r.route_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2 py-0.5 rounded">
                        {r.route_id}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800">{r.departure_city}</td>
                    <td className="py-3.5 px-5 font-semibold text-slate-800">{r.destination_city}</td>
                    <td className="py-3.5 px-5 sb-mono text-amber-700 font-semibold">{r.departure_time}</td>
                    <td className="py-3.5 px-5 sb-mono font-bold text-indigo-950">Rs. {Number(r.ticket_price).toLocaleString()}</td>
                    <td className="py-3.5 px-5">
                      <span className="sb-mono font-bold text-slate-800">{r.available_seats}</span>
                      <span className="text-slate-400"> / {r.total_seats} seats</span>
                    </td>
                    <td className="py-3.5 px-5 text-right space-x-1.5">
                      <button
                        onClick={() => setEditingRoute(r)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-950 hover:bg-slate-100 transition-colors"
                        title="Edit Route"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteRoute(r.route_id)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                        title="Delete Route"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. ALL USERS BOOKINGS VIEW                                            */}
      {/* ===================================================================== */}
      {activeAdminTab === 'bookings' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="sb-display text-lg font-bold text-indigo-950">Master Bookings Registry</h3>
                <p className="text-xs text-slate-500 mt-0.5">Inspect all passenger bookings made across all user accounts in the system</p>
              </div>
              <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                {['ALL', 'Confirmed', 'Cancelled'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setBookingStatusFilter(status)}
                    className={`px-3 py-1 rounded-lg transition-all ${
                      bookingStatusFilter === status ? 'bg-white text-indigo-950 font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* Search */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                placeholder="Search by Booking ID, Passenger name, Route, or User Email..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {filteredBookings.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-400">
                No bookings found matching your search criteria.
              </div>
            ) : (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="py-3.5 px-5">Booking ID</th>
                    <th className="py-3.5 px-5">Passenger</th>
                    <th className="py-3.5 px-5">Account</th>
                    <th className="py-3.5 px-5">Route</th>
                    <th className="py-3.5 px-5">Seats</th>
                    <th className="py-3.5 px-5">Fare</th>
                    <th className="py-3.5 px-5">Date / Time</th>
                    <th className="py-3.5 px-5">Status</th>
                    <th className="py-3.5 px-5 text-right">Admin Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.map((b) => (
                    <tr key={b.booking_id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 sb-mono font-bold text-indigo-950">{b.booking_id}</td>
                      <td className="py-3.5 px-5 font-semibold text-slate-900">
                        {b.passenger_name} ({b.passenger_age} yrs)
                      </td>
                      <td className="py-3.5 px-5 text-slate-600">
                        {b.user_email || b.booked_by_user_email || 'Passenger'}
                      </td>
                      <td className="py-3.5 px-5 sb-mono font-semibold text-slate-800">{b.route_id}</td>
                      <td className="py-3.5 px-5 font-bold text-slate-800">{b.seats} seat(s)</td>
                      <td className="py-3.5 px-5 sb-mono font-extrabold text-indigo-950">Rs. {Number(b.total_fare || 0).toLocaleString()}</td>
                      <td className="py-3.5 px-5 text-slate-500">{b.timestamp}</td>
                      <td className="py-3.5 px-5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.status === 'Confirmed'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        {b.status === 'Confirmed' ? (
                          <button
                            onClick={() => handleAdminCancelBooking(b.booking_id)}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                          >
                            Cancel &amp; Restore
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Restored</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. REGISTERED USERS DIRECTORY                                         */}
      {/* ===================================================================== */}
      {activeAdminTab === 'users' && (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="sb-display text-lg font-bold text-indigo-950">User Accounts Directory</h3>
              <p className="text-xs text-slate-500 mt-0.5">List of all registered system passengers and administrators</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{usersList.length} Accounts</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-5">User ID</th>
                  <th className="py-3.5 px-5">Full Name</th>
                  <th className="py-3.5 px-5">Email Address</th>
                  <th className="py-3.5 px-5">Role</th>
                  <th className="py-3.5 px-5">Created Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-5 sb-mono text-slate-400">#{u.id}</td>
                    <td className="py-3.5 px-5 font-bold text-slate-900">{u.name}</td>
                    <td className="py-3.5 px-5 text-slate-600">{u.email}</td>
                    <td className="py-3.5 px-5">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        u.role === 'admin'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}>
                        {u.role.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-slate-500">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: ADD NEW ROUTE                                                  */}
      {/* ===================================================================== */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-indigo-950 p-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center space-x-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 font-bold shrink-0">
                  <Bus className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="sb-display text-base font-bold text-white">Add New Bus Route</h3>
                  <p className="text-[11px] text-indigo-200 mt-0.5">Register a new scheduled journey into the route catalog</p>
                </div>
              </div>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddRoute} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Route ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. R106"
                    value={newRoute.route_id}
                    onChange={(e) => setNewRoute({ ...newRoute, route_id: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 04:30 PM"
                    value={newRoute.departure_time}
                    onChange={(e) => setNewRoute({ ...newRoute, departure_time: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Karachi"
                    value={newRoute.departure_city}
                    onChange={(e) => setNewRoute({ ...newRoute, departure_city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination City *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad"
                    value={newRoute.destination_city}
                    onChange={(e) => setNewRoute({ ...newRoute, destination_city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ticket Price (Rs) *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 2500"
                    value={newRoute.ticket_price}
                    onChange={(e) => setNewRoute({ ...newRoute, ticket_price: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Coach Capacity *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    placeholder="e.g. 40"
                    value={newRoute.total_seats}
                    onChange={(e) => setNewRoute({ ...newRoute, total_seats: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-indigo-950 text-xs font-bold shadow-md"
                >
                  Create Route
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL: EDIT ROUTE                                                     */}
      {/* ===================================================================== */}
      {editingRoute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[92vh] flex flex-col">
            <div className="bg-indigo-950 p-5 text-white flex items-center justify-between border-b border-white/10 shrink-0">
              <div className="flex items-center space-x-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 font-bold shrink-0">
                  <Edit3 className="h-4 w-4" />
                </span>
                <div>
                  <h3 className="sb-display text-base font-bold text-white">Edit Route {editingRoute.route_id}</h3>
                  <p className="text-[11px] text-indigo-200 mt-0.5">Modify timings, pricing, or seat capacities</p>
                </div>
              </div>
              <button onClick={() => setEditingRoute(null)} className="text-slate-400 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateRoute} className="p-5 sm:p-6 space-y-4 overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure City</label>
                  <input
                    type="text"
                    required
                    value={editingRoute.departure_city}
                    onChange={(e) => setEditingRoute({ ...editingRoute, departure_city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Destination City</label>
                  <input
                    type="text"
                    required
                    value={editingRoute.destination_city}
                    onChange={(e) => setEditingRoute({ ...editingRoute, destination_city: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Departure Time</label>
                  <input
                    type="text"
                    required
                    value={editingRoute.departure_time}
                    onChange={(e) => setEditingRoute({ ...editingRoute, departure_time: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Ticket Price (Rs)</label>
                  <input
                    type="number"
                    required
                    value={editingRoute.ticket_price}
                    onChange={(e) => setEditingRoute({ ...editingRoute, ticket_price: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Total Capacity</label>
                  <input
                    type="number"
                    required
                    value={editingRoute.total_seats}
                    onChange={(e) => setEditingRoute({ ...editingRoute, total_seats: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Available Seats</label>
                  <input
                    type="number"
                    required
                    value={editingRoute.available_seats}
                    onChange={(e) => setEditingRoute({ ...editingRoute, available_seats: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-950"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setEditingRoute(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-300 hover:bg-amber-200 text-indigo-950 text-xs font-bold shadow-md"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
