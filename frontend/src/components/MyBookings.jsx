import React, { useState } from 'react';
import { 
  BookMarked, 
  Search, 
  Ticket, 
  User, 
  Calendar, 
  Ban, 
  CheckCircle2, 
  XCircle,
  Clock,
  ArrowRight,
  Trash2,
  RefreshCw,
  Download
} from 'lucide-react';
import { downloadTicket } from '../utils/ticketGenerator';

export default function MyBookings({ 
  bookings, 
  routes, 
  onCancelBooking, 
  onResetBookings,
  setActiveTab 
}) {
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'Confirmed', 'Cancelled'
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = statusFilter === 'ALL' || b.status === statusFilter;
    const term = searchQuery.trim().toLowerCase();
    const matchesSearch = !term || (
      b.booking_id.toLowerCase().includes(term) ||
      b.passenger_name.toLowerCase().includes(term) ||
      b.route_id.toLowerCase().includes(term)
    );
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="sb-display text-2xl font-bold text-indigo-950">My Bookings History</h2>
            <p className="text-xs text-slate-500 mt-1">
              View your confirmed reservations, download PDF boarding passes, and manage travel history.
            </p>
          </div>

          <div className="flex items-center space-x-2.5 self-start sm:self-auto">
            {bookings.length > 0 && onResetBookings && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to clear all booking records? This will reset all route seats back to full capacity.')) {
                    onResetBookings();
                  }
                }}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold border border-slate-200 hover:border-rose-200 transition-colors flex items-center space-x-1.5"
                title="Clear all booking history"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Bookings</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('book')}
              className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 transition-colors"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-300" />
              <span>Book New Ticket</span>
            </button>
          </div>
        </div>

        {/* Search & Tabs */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {/* Search bar */}
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by Booking ID, Passenger name, or Route..."
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-950 focus:bg-white"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-indigo-950 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({bookings.length})
            </button>
            <button
              onClick={() => setStatusFilter('Confirmed')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'Confirmed'
                  ? 'bg-indigo-950 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Confirmed ({bookings.filter(b => b.status === 'Confirmed').length})
            </button>
            <button
              onClick={() => setStatusFilter('Cancelled')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'Cancelled'
                  ? 'bg-indigo-950 text-white font-bold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Cancelled ({bookings.filter(b => b.status === 'Cancelled').length})
            </button>
          </div>
        </div>
      </div>

      {/* Bookings List or Empty State */}
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <BookMarked className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">No Bookings Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {bookings.length === 0
              ? 'Your booking history is currently empty. Reserve a seat on any route to create your first booking.'
              : 'No booking records matched your search filter criteria.'}
          </p>
          {bookings.length === 0 && (
            <button
              onClick={() => setActiveTab('book')}
              className="mt-4 px-5 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Book a Ticket Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((b) => {
            const route = routes.find((r) => r.route_id === b.route_id);
            const isConfirmed = b.status === 'Confirmed';

            return (
              <div
                key={b.booking_id}
                className={`bg-white rounded-3xl border shadow-xs p-5 sm:p-6 transition-all ${
                  isConfirmed 
                    ? 'border-slate-200 hover:border-slate-300' 
                    : 'border-slate-200 bg-slate-50/50 opacity-80'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Left: ID, Passenger, Route */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-3">
                      <span className="sb-mono text-xs font-bold text-indigo-950 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                        {b.booking_id}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                        isConfirmed
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {isConfirmed ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                            <span>Confirmed</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5 mr-1" />
                            <span>Cancelled</span>
                          </>
                        )}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm font-bold text-slate-900">
                      <span>{b.passenger_name} ({b.passenger_age} yrs)</span>
                      <span className="text-slate-300">•</span>
                      <span className="text-indigo-950 font-semibold">
                        {route ? `${route.departure_city} → ${route.destination_city}` : b.route_id}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span>Route ID: <strong className="sb-mono text-slate-800">{b.route_id}</strong></span>
                      <span>•</span>
                      <span>Reserved: <strong className="text-slate-800">{b.seats} seat{b.seats > 1 ? 's' : ''}</strong></span>
                      {b.timestamp && (
                        <>
                          <span>•</span>
                          <span className="flex items-center text-slate-500 sb-mono">
                            <Clock className="w-3 h-3 mr-1 text-slate-400" />
                            {b.timestamp}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right: Fare & Action Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Total Fare
                      </span>
                      <span className={`sb-display text-xl font-bold ${isConfirmed ? 'text-indigo-950' : 'text-slate-400 line-through'}`}>
                        Rs. {Number(b.total_fare || 0).toLocaleString()}
                      </span>
                    </div>

                    {isConfirmed ? (
                      <div className="mt-2.5 flex items-center space-x-2">
                        <button
                          onClick={() => downloadTicket(b, route)}
                          className="inline-flex items-center px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-indigo-950 hover:bg-indigo-800 shadow-xs transition-colors"
                          title="Download Boarding Pass (PDF)"
                        >
                          <Download className="w-3.5 h-3.5 mr-1 text-amber-300" />
                          <span>PDF Ticket</span>
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel booking ${b.booking_id}? This will restore ${b.seats} seat(s) back to route ${b.route_id}.`)) {
                              onCancelBooking(b.booking_id);
                            }
                          }}
                          className="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors"
                        >
                          <Ban className="w-3.5 h-3.5 mr-1" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    ) : (
                      <span className="mt-2 text-[11px] font-medium text-slate-400 italic">
                        Seats restored to route
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
