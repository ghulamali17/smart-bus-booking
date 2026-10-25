import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  DollarSign, 
  Users, 
  AlertOctagon,
  FileSpreadsheet,
  Bus
} from 'lucide-react';

export default function BookingReports({ routes, bookings }) {
  // Calculations matching Feature 9 & Business Rules
  const totalBookings = bookings.length;
  const confirmedBookings = bookings.filter((b) => b.status === 'Confirmed');
  const cancelledBookings = bookings.filter((b) => b.status === 'Cancelled');
  
  // Rule BR-12: Sum seats and fares from Confirmed records ONLY
  const seatsReserved = confirmedBookings.reduce((sum, b) => sum + b.seats, 0);
  const confirmedRevenue = confirmedBookings.reduce((sum, b) => sum + b.total_fare, 0);

  // Fully booked routes count: available_seats == 0
  const fullyBookedRoutesCount = routes.filter((r) => r.available_seats === 0).length;

  // Group confirmed bookings by route (matching PRD outer route loop, inner booking loop)
  const routeReportData = routes.map((r) => {
    const routeConfirmedBookings = confirmedBookings.filter((b) => b.route_id === r.route_id);
    const routeSeatsBooked = routeConfirmedBookings.reduce((sum, b) => sum + b.seats, 0);
    const routeRevenue = routeConfirmedBookings.reduce((sum, b) => sum + b.total_fare, 0);
    const isFullyBooked = r.available_seats === 0;

    return {
      ...r,
      confirmedCount: routeConfirmedBookings.length,
      seatsBooked: routeSeatsBooked,
      revenue: routeRevenue,
      isFullyBooked,
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="sb-display text-2xl font-bold text-indigo-950">Booking &amp; Financial Reports</h2>
          <p className="text-xs text-slate-500 mt-1">
            Audited performance reports, confirmed ticket revenue, and network utilization metrics.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-950 border border-indigo-100 flex items-center space-x-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Real-Time Audit</span>
          </span>
        </div>
      </div>

      {/* 6 Key Executive Metrics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Metric 1: Total Bookings */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Bookings</span>
          <div className="mt-1.5 sb-display text-2xl font-bold text-indigo-950">{totalBookings}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Created all-time</span>
        </div>

        {/* Metric 2: Confirmed Bookings */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Confirmed</span>
          <div className="mt-1.5 sb-display text-2xl font-bold text-emerald-700">{confirmedBookings.length}</div>
          <span className="text-[11px] text-emerald-600/80 mt-0.5 block">Active tickets</span>
        </div>

        {/* Metric 3: Cancelled Bookings */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">Cancelled</span>
          <div className="mt-1.5 sb-display text-2xl font-bold text-rose-700">{cancelledBookings.length}</div>
          <span className="text-[11px] text-rose-600/80 mt-0.5 block">Seats restored</span>
        </div>

        {/* Metric 4: Seats Currently Reserved */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">Seats Reserved</span>
          <div className="mt-1.5 sb-display text-2xl font-bold text-indigo-950">{seatsReserved}</div>
          <span className="text-[11px] text-indigo-600/80 mt-0.5 block">Confirmed only</span>
        </div>

        {/* Metric 5: Confirmed Revenue */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">Confirmed Revenue</span>
          <div className="mt-1.5 sb-display text-xl font-bold text-indigo-950">Rs. {confirmedRevenue.toLocaleString()}</div>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Excl. cancelled</span>
        </div>

        {/* Metric 6: Fully Booked Routes */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Fully Booked</span>
          <div className="mt-1.5 sb-display text-2xl font-bold text-indigo-950">{fullyBookedRoutesCount}</div>
          <span className="text-[11px] text-slate-500 mt-0.5 block">
            {fullyBookedRoutesCount === 0 ? '0 sold-out routes' : `${fullyBookedRoutesCount} sold-out route${fullyBookedRoutesCount === 1 ? '' : 's'}`}
          </span>
        </div>
      </div>

      {/* Route-by-Route Breakdown Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="sb-display text-lg font-bold text-indigo-950">Route Breakdown Summary</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Aggregated bookings, seat occupancy, and revenue generated per journey.
            </p>
          </div>
          <span className="text-xs font-semibold text-slate-500">
            {routes.length} Active Routes
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[11px] tracking-wider border-b border-slate-100">
              <tr>
                <th className="py-3.5 px-4">Route ID</th>
                <th className="py-3.5 px-4">Journey</th>
                <th className="py-3.5 px-4">Departure</th>
                <th className="py-3.5 px-4">Unit Fare</th>
                <th className="py-3.5 px-4">Confirmed Bookings</th>
                <th className="py-3.5 px-4">Reserved Seats</th>
                <th className="py-3.5 px-4">Remaining Seats</th>
                <th className="py-3.5 px-4">Confirmed Revenue</th>
                <th className="py-3.5 px-4">Capacity Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {routeReportData.map((r) => (
                <tr key={r.route_id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4">
                    <span className="sb-mono font-bold text-xs bg-slate-100 text-indigo-950 border border-slate-200 px-2 py-0.5 rounded">
                      {r.route_id}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {r.departure_city} → {r.destination_city}
                  </td>
                  <td className="py-3.5 px-4 sb-mono text-amber-700 font-semibold">{r.departure_time}</td>
                  <td className="py-3.5 px-4 sb-mono font-medium text-slate-800">Rs. {Number(r.ticket_price).toLocaleString()}</td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">{r.confirmedCount}</td>
                  <td className="py-3.5 px-4 font-semibold text-indigo-950">{r.seatsBooked} seats</td>
                  <td className="py-3.5 px-4 text-slate-600 sb-mono">
                    {r.available_seats} / {r.total_seats}
                  </td>
                  <td className="py-3.5 px-4 sb-mono font-bold text-indigo-950">
                    Rs. {r.revenue.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      r.isFullyBooked
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : r.available_seats < r.total_seats
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {r.isFullyBooked ? 'Fully Booked' : r.available_seats < r.total_seats ? 'Partially Booked' : 'Available'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            {/* Total Footer */}
            <tfoot className="bg-slate-50 font-bold text-xs text-slate-900 border-t-2 border-slate-200">
              <tr>
                <td colSpan={4} className="py-3.5 px-4 uppercase text-[11px] tracking-wider text-slate-600">
                  Total Confirmed Aggregation:
                </td>
                <td className="py-3.5 px-4">{confirmedBookings.length}</td>
                <td className="py-3.5 px-4 text-indigo-950">{seatsReserved} seats</td>
                <td className="py-3.5 px-4 text-slate-600 sb-mono">
                  {routes.reduce((s, r) => s + r.available_seats, 0)} free
                </td>
                <td className="py-3.5 px-4 sb-mono font-extrabold text-indigo-950 text-sm">
                  Rs. {confirmedRevenue.toLocaleString()}
                </td>
                <td className="py-3.5 px-4 text-slate-500 font-normal text-[11px]">
                  {fullyBookedRoutesCount} full route{fullyBookedRoutesCount === 1 ? '' : 's'}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
