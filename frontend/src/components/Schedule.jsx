import React from 'react';
import { 
  CalendarClock, 
  MapPin, 
  Clock, 
  Bus, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { SUPPORTED_CITIES } from '../constants';

export default function Schedule({ routes, setActiveTab, setSelectedRouteId }) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
        <h2 className="sb-display text-2xl font-bold text-indigo-950">Route Schedule by Departure City</h2>
        <p className="text-xs text-slate-500 mt-1">
          Complete network timetable organized by origin terminal with live seat status and timings.
        </p>
      </div>

      {/* City Grouped Schedules */}
      <div className="space-y-6">
        {SUPPORTED_CITIES.map((city) => {
          // Inner filter/loop matching routes departing from this city
          const cityDepartures = routes.filter(
            (r) => r.departure_city.toLowerCase() === city.toLowerCase()
          );

          return (
            <div 
              key={city}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden"
            >
              {/* City Terminal Header */}
              <div className="bg-slate-50/90 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 font-bold text-xs shadow-2xs">
                    {city.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="sb-display text-base font-bold text-indigo-950">{city} Terminal</h3>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {cityDepartures.length} scheduled departure{cityDepartures.length === 1 ? '' : 's'}
                    </span>
                  </div>
                </div>

                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-200/60 text-slate-700">
                  Origin Hub
                </span>
              </div>

              {/* Departures List */}
              <div className="p-6">
                {cityDepartures.length === 0 ? (
                  <div className="py-6 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">No scheduled departures.</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      There are currently no originating journeys departing from {city}.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cityDepartures.map((r) => {
                      const isFull = r.available_seats === 0;

                      return (
                        <div
                          key={r.route_id}
                          className="p-4 rounded-2xl border border-slate-200/90 hover:border-slate-300 bg-white transition-all flex flex-col justify-between shadow-2xs hover:shadow-xs"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-2">
                              <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2 py-0.5 rounded">
                                {r.route_id}
                              </span>
                              <div className="flex items-center space-x-1 text-xs font-bold text-slate-800">
                                <Clock className="w-3.5 h-3.5 text-slate-400" />
                                <span className="sb-mono text-amber-700 font-semibold">{r.departure_time}</span>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 text-sm font-bold text-slate-900 mt-2">
                              <span className="text-slate-400 font-normal text-xs uppercase tracking-wider">To:</span>
                              <span className="text-indigo-950 font-bold">{r.destination_city}</span>
                            </div>

                            <div className="flex items-center justify-between mt-3 text-xs text-slate-500 pt-2 border-t border-slate-100">
                              <span>Fare: <strong className="sb-mono font-bold text-indigo-950">Rs. {Number(r.ticket_price).toLocaleString()}</strong></span>
                              <span className={`sb-mono text-[11px] ${isFull ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                                {r.available_seats} / {r.total_seats} free
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setSelectedRouteId(r.route_id);
                              setActiveTab('book');
                            }}
                            disabled={isFull}
                            className={`mt-3 w-full py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center space-x-1 ${
                              isFull
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-indigo-950 text-white hover:bg-indigo-800 shadow-xs'
                            }`}
                          >
                            <span>{isFull ? 'Fully Booked' : 'Book Journey'}</span>
                            {!isFull && <ArrowRight className="w-3 h-3 text-amber-300" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
