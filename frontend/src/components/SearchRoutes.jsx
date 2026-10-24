import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Clock, 
  Ticket, 
  ArrowRight, 
  AlertCircle, 
  Sparkles,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { SUPPORTED_CITIES } from '../constants';

export default function SearchRoutes({ routes, setActiveTab, setSelectedRouteId }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCityChip, setSelectedCityChip] = useState('All');

  // Filter routes based on search query and city chip
  const filteredRoutes = routes.filter((r) => {
    const term = searchTerm.trim().toLowerCase();
    
    // Check search term
    const matchesQuery = !term || (
      r.route_id.toLowerCase().includes(term) ||
      r.departure_city.toLowerCase().includes(term) ||
      r.destination_city.toLowerCase().includes(term)
    );

    // Check city chip
    const matchesChip = selectedCityChip === 'All' || 
      r.departure_city.toLowerCase() === selectedCityChip.toLowerCase() ||
      r.destination_city.toLowerCase() === selectedCityChip.toLowerCase();

    return matchesQuery && matchesChip;
  });

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <div className="max-w-2xl">
          <h2 className="sb-display text-2xl font-bold text-indigo-950">Search Bus Routes</h2>
          <p className="text-xs text-slate-500 mt-1">
            Search by Route ID (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-950 font-mono font-bold">R101</code>), departure city, or arrival city.
          </p>
        </div>

        {/* Input Bar */}
        <div className="mt-5 relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Route ID (R101), Karachi, Hyderabad, Sukkur..."
            className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-800 placeholder-slate-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-xs font-semibold text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        {/* City Filter Chips */}
        <div className="mt-4 flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-slate-400 mr-1">Quick City:</span>
          <button
            onClick={() => setSelectedCityChip('All')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCityChip === 'All'
                ? 'bg-indigo-950 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Cities
          </button>
          {SUPPORTED_CITIES.map((city) => (
            <button
              key={city}
              onClick={() => setSelectedCityChip(city)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedCityChip === city
                  ? 'bg-indigo-950 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {city}
            </button>
          ))}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800">{filteredRoutes.length}</strong> matching route{filteredRoutes.length === 1 ? '' : 's'}
        </span>
        {searchTerm && (
          <span>
            Query filter: <span className="font-mono font-semibold text-indigo-600">"{searchTerm}"</span>
          </span>
        )}
      </div>

      {/* Results List or Empty State */}
      {filteredRoutes.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center shadow-sm">
          <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl mx-auto flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 font-heading">No Routes Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            No active routes matched your search term <span className="font-semibold text-slate-700 font-mono">"{searchTerm || selectedCityChip}"</span>.
          </p>
          <div className="mt-4 text-xs text-slate-400">
            Try searching for supported cities like <span className="font-medium text-slate-600">Karachi</span>, <span className="font-medium text-slate-600">Hyderabad</span>, or route codes like <span className="font-medium text-slate-600">R101</span>.
          </div>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCityChip('All');
            }}
            className="mt-5 px-4 py-2 rounded-xl bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-bold transition-colors"
          >
            Reset Search Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredRoutes.map((r) => {
            const isFull = r.available_seats === 0;

            return (
              <div 
                key={r.route_id} 
                className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2.5 py-1 rounded-lg">
                      {r.route_id}
                    </span>
                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isFull
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {isFull ? 'Fully Booked' : `${r.available_seats} seats remaining`}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-base font-bold text-slate-900">
                    <span>{r.departure_city}</span>
                    <span className="text-slate-400">→</span>
                    <span>{r.destination_city}</span>
                  </div>

                  <div className="flex items-center space-x-4 mt-3 text-xs text-slate-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span className="sb-mono text-amber-700 font-semibold">{r.departure_time}</span>
                    </div>
                    <span>•</span>
                    <div className="sb-mono font-bold text-indigo-950 text-sm">
                      Rs. {Number(r.ticket_price).toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">
                    Capacity: {r.total_seats} seats
                  </span>
                  <button
                    onClick={() => {
                      setSelectedRouteId(r.route_id);
                      setActiveTab('book');
                    }}
                    disabled={isFull}
                    className={`inline-flex items-center px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isFull
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-950 hover:bg-indigo-800 text-white shadow-xs'
                    }`}
                  >
                    <span>Select &amp; Book</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
