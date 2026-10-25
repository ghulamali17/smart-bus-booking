import React, { useState } from 'react';
import { 
  Bus, 
  Clock, 
  MapPin, 
  Ticket, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight
} from 'lucide-react';

export default function AvailableRoutes({ routes, setActiveTab, setSelectedRouteId }) {
  const [filterAvailableOnly, setFilterAvailableOnly] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  const displayedRoutes = filterAvailableOnly
    ? routes.filter((r) => r.available_seats > 0)
    : routes;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="sb-display text-2xl font-bold text-indigo-950">Available Bus Routes</h2>
          <p className="text-xs text-slate-500 mt-1">
            Browse active intercity routes, scheduled departure times, ticket pricing, and real-time seat availability.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Filter toggle */}
          <button
            onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
            className={`flex items-center space-x-2 px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold border transition-all whitespace-nowrap ${
              filterAvailableOnly
                ? 'bg-indigo-950 text-white border-indigo-950 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Available Seats Only</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'grid' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                viewMode === 'table' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-500 hover:text-slate-900'
              }`}
              title="Table View"
            >
              <TableIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {displayedRoutes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">No Routes Available</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            All routes are currently fully booked. Switch off the "Available Seats Only" filter to view full schedule.
          </p>
          <button
            onClick={() => setFilterAvailableOnly(false)}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
          >
            Show All Routes
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedRoutes.map((r, index) => {
            const isFull = r.available_seats === 0;
            const isPartially = r.available_seats > 0 && r.available_seats < r.total_seats;
            const percentageLeft = Math.round((r.available_seats / r.total_seats) * 100);

            return (
              <div 
                key={r.route_id}
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-5 sm:p-6">
                  {/* Top Bar: Route ID & Status */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className="sb-mono px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-indigo-950 border border-slate-200">
                        {r.route_id}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Route #{index + 1}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full flex items-center space-x-1 ${
                      isFull
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : isPartially
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isFull ? (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          <span>Fully Booked</span>
                        </>
                      ) : isPartially ? (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          <span>Partially Booked</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          <span>Available</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Journey Visual */}
                  <div className="my-3 py-2 px-3 bg-slate-50/70 rounded-xl border border-slate-100">
                    <div className="flex items-center justify-between text-sm font-bold text-slate-900">
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-indigo-600" />
                        <span>{r.departure_city}</span>
                      </div>
                      <span className="text-slate-300 px-2 font-mono">────►</span>
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-4 h-4 text-violet-600" />
                        <span>{r.destination_city}</span>
                      </div>
                    </div>
                  </div>

                  {/* Route Meta Details */}
                  <div className="grid grid-cols-2 gap-3 mt-4 text-xs">
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Departure</span>
                      <div className="flex items-center space-x-1 text-slate-800 font-bold mt-0.5">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        <span>{r.departure_time}</span>
                      </div>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <span className="text-slate-400 block text-[10px] font-semibold uppercase">Ticket Fare</span>
                      <div className="sb-mono text-indigo-950 font-bold text-sm mt-0.5">
                        Rs. {Number(r.ticket_price).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Seat Availability Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <span className="text-slate-500 font-medium">Seats Remaining</span>
                      <span className="font-bold text-slate-800">
                        {r.available_seats} <span className="text-slate-400 font-normal">/ {r.total_seats}</span>
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          isFull ? 'bg-rose-500' : isPartially ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                        style={{ width: `${percentageLeft}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Button */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {r.available_seats} seats free
                  </span>
                    <button
                    onClick={() => {
                      setSelectedRouteId(r.route_id);
                      setActiveTab('book');
                    }}
                    disabled={isFull}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      isFull
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-950 hover:bg-indigo-800 text-white'
                    }`}
                  >
                    <span>Book Ticket</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
                <tr>
                  <th className="py-3.5 px-4">No.</th>
                  <th className="py-3.5 px-4">Route ID</th>
                  <th className="py-3.5 px-4">Journey</th>
                  <th className="py-3.5 px-4">Departure</th>
                  <th className="py-3.5 px-4">Fare</th>
                  <th className="py-3.5 px-4">Seats (Available / Total)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedRoutes.map((r, index) => {
                  const isFull = r.available_seats === 0;
                  const isPartially = r.available_seats > 0 && r.available_seats < r.total_seats;

                  return (
                    <tr key={r.route_id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4 px-4 font-mono font-medium text-slate-400">{index + 1}</td>
                      <td className="py-4 px-4">
                        <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2 py-0.5 rounded">
                          {r.route_id}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-semibold text-slate-900">
                        {r.departure_city} <span className="text-slate-400">→</span> {r.destination_city}
                      </td>
                      <td className="py-4 px-4 sb-mono text-amber-700 font-semibold">{r.departure_time}</td>
                      <td className="py-4 px-4 sb-mono font-bold text-indigo-950">Rs. {Number(r.ticket_price).toLocaleString()}</td>
                      <td className="py-4 px-4">
                        <span className="sb-mono font-bold text-slate-800">{r.available_seats}</span>
                        <span className="text-slate-400"> / {r.total_seats}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                          isFull
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : isPartially
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}>
                          {isFull ? 'Fully Booked' : isPartially ? 'Partially Booked' : 'Available'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedRouteId(r.route_id);
                            setActiveTab('book');
                          }}
                          disabled={isFull}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                            isFull
                              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              : 'bg-indigo-950 text-white hover:bg-indigo-800 shadow-xs'
                          }`}
                        >
                          Book Ticket
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
