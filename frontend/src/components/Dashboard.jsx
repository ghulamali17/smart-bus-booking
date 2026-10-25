import React from 'react';
import {
  Bus,
  Ticket,
  CheckCircle2,
  ArrowRight,
  Search,
  ShieldCheck,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  Sparkles,
  Wallet,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Dashboard({ routes, bookings, setActiveTab, setSelectedRouteId }) {
  const { user, isAdmin } = useAuth();

  const confirmedBookings = bookings.filter(b => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter(b => b.status === 'Cancelled');

  const totalAmount = confirmedBookings.reduce((sum, b) => sum + b.total_fare, 0);
  const totalSeatsCapacity = routes.reduce((sum, r) => sum + r.total_seats, 0);
  const totalSeatsAvailable = routes.reduce((sum, r) => sum + r.available_seats, 0);
  const totalReservedSeats = confirmedBookings.reduce((sum, b) => sum + b.seats, 0);

  const occupancyRate = totalSeatsCapacity > 0
    ? Math.round(((totalSeatsCapacity - totalSeatsAvailable) / totalSeatsCapacity) * 100)
    : 0;

  const userBalance = user?.balance ?? 10000;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* ===================================================================== */}
      {/* 1. HERO WELCOME BANNER (Deep Navy + Amber Accent)                     */}
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

        <div className="relative z-10 max-w-2xl">
          {/* User Status / Wallet Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 border border-white/10 text-xs font-semibold backdrop-blur-md mb-3.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>{isAdmin ? 'System Administrator Console' : `Passenger Hub • Wallet Balance: Rs. ${userBalance.toLocaleString()}`}</span>
          </div>

          <h1 className="sb-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
            Welcome to SmartBus Express
          </h1>

          <p className="mt-2.5 text-xs sm:text-sm text-indigo-100/80 leading-relaxed">
            Reserve intercity seats across Karachi, Hyderabad, Sukkur, Mirpur Khas, and Lahore with real-time seat availability and instant PDF boarding pass downloads.
          </p>

          <div className="mt-6 flex flex-col sm:flex-row flex-wrap gap-2.5 sm:gap-3">
            <button
              onClick={() => setActiveTab('book')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-amber-300 px-5 py-2.5 text-xs sm:text-sm font-bold text-indigo-950 shadow-md shadow-black/20 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
            >
              <Ticket className="h-4 w-4" />
              <span>Book Ticket Now</span>
            </button>
            <button
              onClick={() => setActiveTab('search')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-4 py-2.5 text-xs sm:text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none"
            >
              <Search className="h-4 w-4 text-indigo-200" />
              <span>Search Routes</span>
            </button>
            <button
              onClick={() => setActiveTab('my-bookings')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-200 transition hover:bg-white/10 focus:outline-none"
            >
              <span>My Bookings ({bookings.length})</span>
            </button>
          </div>
        </div>

        {/* Decorative Bus Silhouette */}
        <div className="absolute right-0 top-0 -bottom-8 w-96 opacity-10 pointer-events-none hidden md:flex items-center justify-center">
          <Bus className="w-80 h-80 transform translate-x-12" />
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. SUMMARY METRIC STRIP (Role-Aware Cards)                            */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Active Routes */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Scheduled Routes</span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
              <Bus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
            <span className="sb-display text-xl sm:text-2xl font-bold text-indigo-950">{routes.length}</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Active
            </span>
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500">5 Regional Hubs</p>
        </div>

        {/* Card 2: Bookings */}
        <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">
              {isAdmin ? 'Confirmed Bookings' : 'My Bookings'}
            </span>
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </span>
          </div>
          <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
            <span className="sb-display text-xl sm:text-2xl font-bold text-indigo-950">{confirmedBookings.length}</span>
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
              {totalReservedSeats} seat{totalReservedSeats === 1 ? '' : 's'}
            </span>
          </div>
          <p className="mt-1 text-[11px] sm:text-xs text-slate-500">{cancelledBookings.length} cancelled</p>
        </div>

        {/* Card 3: Fleet Occupancy (Admin) OR Wallet Balance (User) */}
        {isAdmin ? (
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Fleet Occupancy</span>
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                <Ticket className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
              <span className="sb-display text-xl sm:text-2xl font-bold text-indigo-950">{occupancyRate}%</span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full">
                {totalSeatsAvailable} free
              </span>
            </div>
            <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-950 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${occupancyRate}%` }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Wallet Balance</span>
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Wallet className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
              <span className="sb-display text-xl sm:text-2xl font-bold text-indigo-950">
                Rs. {userBalance.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                Available
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500">Credit: Rs. 10,000</p>
          </div>
        )}

        {/* Card 4: Confirmed Revenue (Admin) OR Total Money Spent (User) */}
        {isAdmin ? (
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Confirmed Revenue</span>
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <TrendingUp className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
              <span className="sb-display text-xl sm:text-2xl font-bold text-indigo-950">
                Rs. {totalAmount.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-full">
                Net
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500">Excludes cancelled trips</p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-3.5 sm:p-5 border border-slate-200 shadow-xs hover:border-slate-300 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Money Spent</span>
              <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                <CreditCard className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </span>
            </div>
            <div className="mt-2.5 sm:mt-3 flex items-baseline justify-between">
              <span className="sb-display text-xl sm:text-2xl font-bold text-indigo-950">
                Rs. {totalAmount.toLocaleString()}
              </span>
              <span className="text-[10px] sm:text-[11px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                Paid
              </span>
            </div>
            <p className="mt-1 text-[11px] sm:text-xs text-slate-500">Excludes cancelled trips</p>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* 3. ACTIVE ROUTES OVERVIEW & RECENT BOOKINGS                           */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Routes List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div>
              <h2 className="sb-display text-lg font-bold text-indigo-950">Active Routes Overview</h2>
              <p className="text-xs text-slate-500 mt-0.5">Live schedule, seat capacity, and standard pricing</p>
            </div>
            <button
              onClick={() => setActiveTab('routes')}
              className="inline-flex items-center gap-1 text-xs font-bold text-indigo-950 hover:text-indigo-700 transition-colors"
            >
              <span>View All</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {routes.map((r) => {
              const isFull = r.available_seats === 0;
              const isLow = !isFull && r.available_seats <= 5;

              return (
                <div key={r.route_id} className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2.5 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2 py-1 rounded-md shrink-0">
                      {r.route_id}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-1.5 text-sm font-semibold text-slate-900 truncate">
                        <span>{r.departure_city}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{r.destination_city}</span>
                      </div>
                      <div className="flex items-center text-xs text-slate-500 space-x-2 mt-0.5">
                        <span className="sb-mono text-amber-700 font-semibold">{r.departure_time}</span>
                        <span>•</span>
                        <span className="sb-mono font-bold text-indigo-950">Rs. {Number(r.ticket_price).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 shrink-0 ml-3">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs font-semibold text-slate-700 sb-mono">
                        {r.available_seats} / {r.total_seats} seats
                      </div>
                      <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${isFull
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isLow
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                        {isFull ? 'Full' : isLow ? 'Few left' : 'Available'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedRouteId(r.route_id);
                        setActiveTab('book');
                      }}
                      disabled={isFull}
                      className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all ${isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-950 text-white hover:bg-indigo-800 shadow-xs'
                        }`}
                    >
                      {isFull ? 'Full' : 'Book'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Recent Bookings & Guidelines (1 Col) */}
        <div className="space-y-6">
          {/* Recent Bookings Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h2 className="sb-display text-base font-bold text-indigo-950">Recent Bookings</h2>
              <button
                onClick={() => setActiveTab('my-bookings')}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-950 hover:text-indigo-700 transition-colors"
              >
                <span>All</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {bookings.length === 0 ? (
              <div className="py-8 text-center">
                <Ticket className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No bookings recorded yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Tickets booked on this device will appear here.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {bookings.slice(0, 4).map((b) => (
                  <div key={b.booking_id} className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="sb-mono text-xs font-bold text-indigo-950 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {b.booking_id}
                        </span>
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[110px]">
                          {b.passenger_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1 sb-mono">
                        Route {b.route_id} • {b.seats} seat{b.seats > 1 ? 's' : ''} • Rs. {Number(b.total_fare).toLocaleString()}
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${b.status === 'Confirmed'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Guidelines Box */}
          <div className="rounded-3xl border border-indigo-100 bg-indigo-50/60 p-5">
            <div className="flex items-start space-x-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 shrink-0 mt-0.5 shadow-xs">
                <ShieldCheck className="h-4 w-4" />
              </span>
              <div>
                <h3 className="sb-display text-xs font-bold text-indigo-950 uppercase tracking-wider">
                  Passenger Guidelines
                </h3>
                <ul className="text-xs text-indigo-950/80 mt-2 space-y-1.5 list-disc list-inside">
                  <li>Instant verified seat allocation</li>
                  <li>Real-time seat release upon cancellation</li>
                  <li>Official PDF boarding passes with barcodes</li>
                  <li>Report at departure hub 15 mins prior</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
