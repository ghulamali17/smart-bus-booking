import React, { useState } from 'react';
import { 
  Ban, 
  Search, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function CancelBooking({ 
  bookings, 
  routes, 
  onCancelBooking,
  setActiveTab 
}) {
  const [bookingIdInput, setBookingIdInput] = useState('');
  const [message, setMessage] = useState(null); // { type: 'success' | 'error' | 'warning', text: string, data?: any }

  const handleLookupAndCancel = (e) => {
    e.preventDefault();
    const id = bookingIdInput.trim().toUpperCase();

    if (!id) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid Booking ID (e.g., B1001).'
      });
      return;
    }

    // Find booking
    const booking = bookings.find((b) => b.booking_id.toUpperCase() === id);

    // Rule BR-09: Booking must exist
    if (!booking) {
      setMessage({
        type: 'error',
        text: `Booking record '${id}' was not found in our system.`
      });
      return;
    }

    // Rule BR-09 & BR-10: Only Confirmed booking can be cancelled; prevent double cancellation
    if (booking.status === 'Cancelled') {
      setMessage({
        type: 'warning',
        text: `Booking '${id}' has already been cancelled.`
      });
      return;
    }

    // Confirmed booking found -> Cancel and restore seats
    const result = onCancelBooking(booking.booking_id);
    const route = routes.find((r) => r.route_id === booking.route_id);

    setMessage({
      type: 'success',
      text: `Booking '${booking.booking_id}' has been cancelled successfully.`,
      data: {
        bookingId: booking.booking_id,
        passengerName: booking.passenger_name,
        routeId: booking.route_id,
        seatsRestored: booking.seats,
        newAvailableSeats: (route?.available_seats || 0) + booking.seats,
      }
    });

    setBookingIdInput('');
  };

  const activeConfirmedBookings = bookings.filter((b) => b.status === 'Confirmed');

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="sb-display text-2xl font-bold text-indigo-950">Cancel a Booking</h2>
        <p className="text-xs text-slate-500 mt-1">
          Look up your booking ID to cancel your reservation and release reserved seats.
        </p>
      </div>

      {/* Main Cancellation Form */}
      <form onSubmit={handleLookupAndCancel} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-5">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Enter Booking ID <span className="text-rose-500">*</span>
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={bookingIdInput}
                onChange={(e) => {
                  setBookingIdInput(e.target.value);
                  if (message) setMessage(null);
                }}
                placeholder="e.g. B1001"
                className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sb-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Ban className="w-3.5 h-3.5" />
              <span>Cancel Ticket</span>
            </button>
          </div>
        </div>

        {/* Feedback Message */}
        {message && (
          <div className={`p-4 rounded-2xl border text-xs flex items-start space-x-3 ${
            message.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : message.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}>
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            ) : message.type === 'warning' ? (
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            )}
            
            <div className="flex-1">
              <p className="font-semibold">{message.text}</p>
              {message.data && (
                <div className="mt-3 pt-3 border-t border-emerald-200/60 grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-emerald-700 block">Passenger:</span>
                    <strong className="text-emerald-950">{message.data.passengerName}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block">Route:</span>
                    <strong className="text-emerald-950 sb-mono">{message.data.routeId}</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block">Seats Restored:</span>
                    <strong className="text-emerald-950">+{message.data.seatsRestored} seats</strong>
                  </div>
                  <div>
                    <span className="text-emerald-700 block">New Available Seats:</span>
                    <strong className="text-emerald-950">{message.data.newAvailableSeats} seats</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </form>

      {/* Quick Select from Active Bookings */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Or Select From Active Confirmed Bookings ({activeConfirmedBookings.length})
        </h3>

        {activeConfirmedBookings.length === 0 ? (
          <p className="text-xs text-slate-400 py-3 text-center">
            No active confirmed bookings available to cancel.
          </p>
        ) : (
          <div className="space-y-2.5">
            {activeConfirmedBookings.map((b) => (
              <div 
                key={b.booking_id}
                className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/60 flex items-center justify-between hover:bg-slate-100/70 transition-colors"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="sb-mono text-xs font-bold text-indigo-950">{b.booking_id}</span>
                    <span className="text-xs text-slate-800 font-semibold">({b.passenger_name})</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Route <span className="sb-mono font-medium text-slate-700">{b.route_id}</span> • {b.seats} seat{b.seats > 1 ? 's' : ''} • <span className="sb-mono font-bold text-indigo-950">Rs. {Number(b.total_fare || 0).toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setBookingIdInput(b.booking_id);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-indigo-950 bg-white hover:bg-slate-50 border border-slate-200 shadow-2xs transition-colors"
                >
                  Select ID
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
