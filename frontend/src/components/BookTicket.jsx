import React, { useState, useEffect } from 'react';
import { 
  Ticket, 
  User, 
  Calendar, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  Coins,
  RefreshCw,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { downloadTicket } from '../utils/ticketGenerator';

export default function BookTicket({ 
  routes, 
  bookings, 
  onBookSuccess, 
  selectedRouteId, 
  setSelectedRouteId,
  setActiveTab 
}) {
  const { user } = useAuth();

  const [passengerName, setPassengerName] = useState(user?.name || '');
  const [passengerAge, setPassengerAge] = useState('');
  const [routeId, setRouteId] = useState(selectedRouteId || (routes[0]?.route_id || ''));
  const [seats, setSeats] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  
  // Validation errors object
  const [errors, setErrors] = useState({});
  // Confirmed booking receipt state
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Update internal routeId if prop changes
  useEffect(() => {
    if (selectedRouteId) {
      setRouteId(selectedRouteId);
    }
  }, [selectedRouteId]);

  // Set user name if available and not yet typed
  useEffect(() => {
    if (user?.name && !passengerName) {
      setPassengerName(user.name);
    }
  }, [user]);

  const selectedRoute = routes.find((r) => r.route_id === routeId) || routes[0];
  const ticketPrice = selectedRoute?.ticket_price || 0;
  const availableSeats = selectedRoute?.available_seats ?? 0;
  
  // Dynamic fare calculation
  const calculatedFare = seats > 0 ? ticketPrice * Number(seats) : 0;

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // 1. Name validation (BR-01)
    if (!passengerName || passengerName.trim().length === 0) {
      newErrors.passengerName = 'Passenger name is required and cannot be blank.';
    }

    // 2. Age validation (BR-02)
    const ageNum = Number(passengerAge);
    if (!passengerAge || isNaN(ageNum) || !Number.isInteger(ageNum) || ageNum <= 0) {
      newErrors.passengerAge = 'Age must be a valid positive whole number (greater than 0).';
    } else if (ageNum > 120) {
      newErrors.passengerAge = 'Please enter a realistic age (1-120).';
    }

    // 3. Route existence (BR-03)
    if (!selectedRoute) {
      newErrors.routeId = 'Selected route is invalid or does not exist.';
    }

    // 4. Seat quantity validation (BR-04, TC-05)
    const seatsNum = Number(seats);
    if (!seats || isNaN(seatsNum) || !Number.isInteger(seatsNum) || seatsNum <= 0) {
      newErrors.seats = 'Seat quantity must be a positive integer (at least 1 seat).';
    } else if (selectedRoute && seatsNum > selectedRoute.available_seats) {
      // 5. Overbooking validation (BR-05, TC-06)
      newErrors.seats = `Cannot book ${seatsNum} seats! Only ${selectedRoute.available_seats} seat${selectedRoute.available_seats === 1 ? '' : 's'} available on ${selectedRoute.route_id}.`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const seatsNum = parseInt(seats, 10);
    const ageNum = parseInt(passengerAge, 10);

    setSubmitting(true);
    try {
      // AWAIT the async onBookSuccess call from App.jsx
      const newBooking = await onBookSuccess({
        passengerName: passengerName.trim(),
        passengerAge: ageNum,
        routeId: selectedRoute.route_id,
        seats: seatsNum,
        totalFare: ticketPrice * seatsNum,
      });

      if (newBooking) {
        setConfirmedBooking(newBooking);
      }
    } catch (err) {
      setErrors({ form: err.message || 'Booking failed. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetForm = () => {
    setPassengerName(user?.name || '');
    setPassengerAge('');
    setSeats(1);
    setErrors({});
    setConfirmedBooking(null);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="sb-display text-2xl font-bold text-indigo-950">Book Bus Ticket</h2>
        <p className="text-xs text-slate-500 mt-1">
          Select your preferred route and reserve seats with instant confirmation.
        </p>
      </div>

      {/* Confirmation Success Modal / Card */}
      {confirmedBooking ? (
        <div className="bg-white rounded-3xl border border-emerald-200 shadow-xl overflow-hidden p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
          <div className="text-center max-w-md mx-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-50">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 uppercase tracking-wider">
              Booking Confirmed
            </span>
            <h3 className="sb-display text-2xl font-bold text-indigo-950 mt-2">
              Ticket Reserved Successfully
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Your booking record has been confirmed and route seats have been deducted.
            </p>
          </div>

          {/* Ticket Receipt Card */}
          <div className="mt-6 bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-lg mx-auto divide-y divide-slate-200">
            <div className="pb-3 flex justify-between items-center">
              <span className="text-xs text-slate-500 font-medium">Booking ID</span>
              <span className="sb-mono text-xs font-bold text-indigo-950 bg-slate-200/70 border border-slate-300 px-2 py-0.5 rounded">
                {confirmedBooking?.booking_id || 'B1001'}
              </span>
            </div>
            
            <div className="py-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-500">Passenger Name</span>
              <span className="font-bold text-slate-900">
                {confirmedBooking?.passenger_name || passengerName} ({confirmedBooking?.passenger_age || passengerAge} yrs)
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-500">Route Journey</span>
              <span className="font-semibold text-slate-800">
                {selectedRoute?.departure_city} → {selectedRoute?.destination_city} (<span className="sb-mono font-bold text-indigo-950">{confirmedBooking?.route_id || selectedRoute?.route_id}</span>)
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-500">Seats Reserved</span>
              <span className="font-bold text-slate-900">
                {confirmedBooking?.seats || seats} seat{(confirmedBooking?.seats || seats) > 1 ? 's' : ''}
              </span>
            </div>

            <div className="py-2.5 flex justify-between items-center text-xs">
              <span className="text-slate-500">Fare per Seat</span>
              <span className="sb-mono text-slate-700 font-medium">Rs. {selectedRoute?.ticket_price}</span>
            </div>

            <div className="pt-3 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-700">Total Fare Charged</span>
              <span className="sb-display text-xl font-bold text-indigo-950">
                Rs. {Number(confirmedBooking?.total_fare || calculatedFare).toLocaleString()}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => downloadTicket(confirmedBooking, selectedRoute)}
              className="px-6 py-2.5 rounded-xl bg-indigo-950 hover:bg-indigo-800 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Download Boarding Pass (PDF)</span>
            </button>
            <button
              onClick={handleResetForm}
              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
            >
              Book Another Ticket
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 font-semibold text-xs transition-all"
            >
              View My Bookings
            </button>
          </div>
        </div>
      ) : (
        /* The Booking Form */
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 sm:p-8 space-y-6">
          {/* Global validation summary alert if errors exist */}
          {Object.keys(errors).length > 0 && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start space-x-3 text-rose-800 text-xs">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Please correct the validation errors:</span>
                <ul className="mt-1 list-disc list-inside space-y-0.5">
                  {Object.values(errors).map((err, i) => (
                    <li key={i}>{err}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Route Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Bus Route <span className="text-rose-500">*</span>
            </label>
            <select
              value={routeId}
              onChange={(e) => {
                setRouteId(e.target.value);
                setSelectedRouteId(e.target.value);
                if (errors.routeId || errors.seats) {
                  setErrors((prev) => ({ ...prev, routeId: null, seats: null }));
                }
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            >
              {routes.map((r) => (
                <option key={r.route_id} value={r.route_id} disabled={r.available_seats === 0}>
                  {r.route_id}: {r.departure_city} → {r.destination_city} ({r.departure_time}) — Rs. {r.ticket_price} ({r.available_seats} seats free)
                  {r.available_seats === 0 ? ' [FULLY BOOKED]' : ''}
                </option>
              ))}
            </select>

            {/* Selected Route Highlights */}
            {selectedRoute && (
              <div className="mt-3 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2 text-indigo-900 font-semibold">
                  <MapPin className="w-4 h-4 text-indigo-600" />
                  <span>{selectedRoute.departure_city} to {selectedRoute.destination_city}</span>
                  <span className="text-indigo-400">•</span>
                  <span>{selectedRoute.departure_time}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-slate-600">
                    Remaining: <strong className="text-indigo-900">{selectedRoute.available_seats}</strong> / {selectedRoute.total_seats}
                  </span>
                  <span className="font-extrabold text-indigo-700">
                    Rs. {selectedRoute.ticket_price} / seat
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Passenger Name */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Passenger Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => {
                    setPassengerName(e.target.value);
                    if (errors.passengerName) setErrors((prev) => ({ ...prev, passengerName: null }));
                  }}
                  placeholder="e.g. Ahmed Ali"
                  className={`w-full pl-9 pr-3 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white ${
                    errors.passengerName 
                      ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' 
                      : 'border-slate-200 focus:ring-indigo-500'
                  }`}
                />
              </div>
              {errors.passengerName && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.passengerName}</p>
              )}
            </div>

            {/* Passenger Age */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Passenger Age <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={passengerAge}
                onChange={(e) => {
                  setPassengerAge(e.target.value);
                  if (errors.passengerAge) setErrors((prev) => ({ ...prev, passengerAge: null }));
                }}
                placeholder="e.g. 24"
                className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:bg-white ${
                  errors.passengerAge 
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' 
                    : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />
              {errors.passengerAge && (
                <p className="mt-1 text-xs text-rose-600 font-medium">{errors.passengerAge}</p>
              )}
            </div>
          </div>

          {/* Number of Seats */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Number of Seats to Reserve <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-500">
                Max available: <strong className="text-slate-800">{availableSeats}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
              <input
                type="number"
                min="1"
                max={availableSeats || 1}
                value={seats}
                onChange={(e) => {
                  setSeats(e.target.value);
                  if (errors.seats) setErrors((prev) => ({ ...prev, seats: null }));
                }}
                className={`sm:col-span-2 px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:bg-white ${
                  errors.seats 
                    ? 'border-rose-400 focus:ring-rose-400 bg-rose-50/30' 
                    : 'border-slate-200 focus:ring-indigo-500'
                }`}
              />

              {/* Quick Seat Selector Chips */}
              <div className="sm:col-span-2 flex items-center space-x-2">
                {[1, 2, 3, 4].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => {
                      setSeats(num);
                      if (errors.seats) setErrors((prev) => ({ ...prev, seats: null }));
                    }}
                    disabled={num > availableSeats}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg border transition-all ${
                      Number(seats) === num
                        ? 'bg-indigo-950 text-white border-indigo-950 shadow-xs'
                        : num > availableSeats
                        ? 'bg-slate-100 text-slate-300 border-slate-200 cursor-not-allowed'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {errors.seats && (
              <p className="mt-1 text-xs text-rose-600 font-medium">{errors.seats}</p>
            )}
          </div>

          {/* Live Fare Calculation Box */}
          <div className="relative overflow-hidden bg-indigo-950 text-white p-5 rounded-2xl border border-white/10 ring-1 ring-white/10 shadow-lg">
            <div
              className="pointer-events-none absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'radial-gradient(30rem 15rem at 90% 0%, rgba(99,102,241,.5), transparent 60%)',
              }}
            />
            <div className="relative z-10 flex items-center justify-between text-xs text-indigo-200 pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Coins className="w-4 h-4 text-amber-300" />
                <span className="font-semibold text-white">Fare Breakdown</span>
              </div>
              <span className="sb-mono font-medium">{seats > 0 ? `${seats} seat(s) × Rs. ${Number(ticketPrice).toLocaleString()}` : '0 seats'}</span>
            </div>

            <div className="relative z-10 mt-3.5 flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fare</span>
                <span className="sb-display text-3xl font-bold text-amber-300">
                  Rs. {calculatedFare.toLocaleString()}
                </span>
              </div>

              <span className="text-[11px] font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-3 py-1 rounded-full">
                All taxes included
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={availableSeats === 0 || submitting}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 ${
              availableSeats === 0 || submitting
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                : 'bg-indigo-950 hover:bg-indigo-800 text-white active:scale-[0.99] shadow-xs'
            }`}
          >
            {submitting ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Reserving Your Seat...</span>
              </>
            ) : (
              <>
                <Ticket className="w-4 h-4 text-amber-300" />
                <span>Confirm &amp; Book Ticket</span>
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
}
