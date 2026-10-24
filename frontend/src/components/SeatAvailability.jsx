import React, { useState } from 'react';
import { 
  PieChart, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Filter, 
  Bus, 
  Users,
  ArrowRight
} from 'lucide-react';

export default function SeatAvailability({ routes, setActiveTab, setSelectedRouteId }) {
  const [filterCategory, setFilterCategory] = useState('ALL'); // 'ALL', 'Available', 'Partially Booked', 'Fully Booked'
  const [expandedRouteId, setExpandedRouteId] = useState(routes[0]?.route_id || null);

  const totalSeats = routes.reduce((sum, r) => sum + r.total_seats, 0);
  const totalAvailable = routes.reduce((sum, r) => sum + r.available_seats, 0);
  const totalOccupied = totalSeats - totalAvailable;
  const overallPercentage = totalSeats > 0 ? Math.round((totalOccupied / totalSeats) * 100) : 0;

  const getRouteCategory = (r) => {
    if (r.available_seats === 0) return 'Fully Booked';
    if (r.available_seats === r.total_seats) return 'Available';
    return 'Partially Booked';
  };

  const filteredRoutes = routes.filter((r) => {
    if (filterCategory === 'ALL') return true;
    return getRouteCategory(r) === filterCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="sb-display text-2xl font-bold text-indigo-950">Seat Availability &amp; Fleet Capacity</h2>
        <p className="text-xs text-slate-500 mt-1">
          Monitor real-time seat status, remaining capacity, and passenger load across the network.
        </p>

        {/* Global Capacity Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mt-5 pt-4 border-t border-slate-100">
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/60">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Fleet Capacity</span>
            <span className="sb-display text-2xl font-bold text-indigo-950 mt-1 block">{totalSeats} <span className="text-xs font-normal text-slate-500">seats</span></span>
          </div>
          <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Available Seats</span>
            <span className="sb-display text-2xl font-bold text-emerald-800 mt-1 block">{totalAvailable} <span className="text-xs font-normal text-emerald-600">seats</span></span>
          </div>
          <div className="p-3.5 bg-indigo-50 rounded-2xl border border-indigo-100">
            <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Reserved Seats</span>
            <span className="sb-display text-2xl font-bold text-indigo-950 mt-1 block">{totalOccupied} <span className="text-xs font-normal text-indigo-600">seats</span></span>
          </div>
          <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200/60">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Network Occupancy</span>
            <span className="sb-display text-2xl font-bold text-amber-900 mt-1 block">{overallPercentage}%</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        <span className="text-slate-400 mr-1 flex items-center">
          <Filter className="w-3.5 h-3.5 mr-1" />
          Filter:
        </span>
        {[
          { id: 'ALL', label: `All Routes (${routes.length})` },
          { id: 'Available', label: `Available (${routes.filter(r => getRouteCategory(r) === 'Available').length})` },
          { id: 'Partially Booked', label: `Partially Booked (${routes.filter(r => getRouteCategory(r) === 'Partially Booked').length})` },
          { id: 'Fully Booked', label: `Fully Booked (${routes.filter(r => getRouteCategory(r) === 'Fully Booked').length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterCategory(tab.id)}
            className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all ${
              filterCategory === tab.id
                ? 'bg-indigo-950 text-white font-bold shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Routes Seat List */}
      <div className="space-y-4">
        {filteredRoutes.map((r) => {
          const category = getRouteCategory(r);
          const percentAvailable = Math.round((r.available_seats / r.total_seats) * 100);
          const bookedSeatsCount = r.total_seats - r.available_seats;
          const isExpanded = expandedRouteId === r.route_id;

          return (
            <div 
              key={r.route_id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-5 sm:p-6 transition-all hover:border-slate-300"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1.5">
                    <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2 py-0.5 rounded">
                      {r.route_id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                      category === 'Fully Booked'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : category === 'Partially Booked'
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {category === 'Fully Booked' && <XCircle className="w-3 h-3 mr-1" />}
                      {category === 'Partially Booked' && <AlertTriangle className="w-3 h-3 mr-1" />}
                      {category === 'Available' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                      <span>{category}</span>
                    </span>
                  </div>

                  <h3 className="sb-display text-base font-bold text-indigo-950">
                    {r.departure_city} → {r.destination_city}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Departs at <span className="sb-mono text-amber-700 font-semibold">{r.departure_time}</span> • <span className="sb-mono font-bold text-indigo-950">Rs. {Number(r.ticket_price).toLocaleString()}</span> per seat
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2">
                  <div className="text-left sm:text-right">
                    <span className="sb-display text-xl font-bold text-indigo-950">
                      {r.available_seats} <span className="text-xs font-normal text-slate-400">/ {r.total_seats} seats free</span>
                    </span>
                    <span className="text-[11px] block text-slate-500 font-medium">
                      ({percentAvailable}% available)
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setExpandedRouteId(isExpanded ? null : r.route_id)}
                      className="text-xs text-indigo-950 hover:text-indigo-700 font-bold px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      {isExpanded ? 'Hide Layout' : 'View Bus Layout'}
                    </button>
                    {r.available_seats > 0 && (
                      <button
                        onClick={() => {
                          setSelectedRouteId(r.route_id);
                          setActiveTab('book');
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-indigo-950 hover:bg-indigo-800 text-white text-xs font-bold shadow-xs transition-colors"
                      >
                        Book
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-4">
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-2.5 rounded-full transition-all duration-500 ${
                      category === 'Fully Booked'
                        ? 'bg-rose-500'
                        : category === 'Partially Booked'
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${percentAvailable}%` }}
                  ></div>
                </div>
              </div>

              {/* Interactive Bus Seating Grid Visualization */}
              {isExpanded && (
                <div className="mt-5 pt-5 border-t border-slate-100 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-slate-700">Coach Seating Grid Demonstration:</span>
                    <div className="flex items-center space-x-3 text-[11px]">
                      <div className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
                        <span>Available</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="w-2.5 h-2.5 rounded-sm bg-slate-300"></span>
                        <span>Booked</span>
                      </div>
                    </div>
                  </div>

                  {/* Seat grid */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 overflow-x-auto">
                    <div className="grid grid-cols-10 gap-2 min-w-[500px]">
                      {Array.from({ length: r.total_seats }).map((_, idx) => {
                        const isBooked = idx < bookedSeatsCount;
                        return (
                          <div
                            key={idx}
                            className={`p-2 rounded-lg text-center text-[10px] font-bold border transition-colors ${
                              isBooked
                                ? 'bg-slate-200 text-slate-400 border-slate-300'
                                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            }`}
                          >
                            #{idx + 1}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
