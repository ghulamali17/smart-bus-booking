import React from 'react';
import { 
  Bus, 
  LayoutDashboard, 
  Compass, 
  Search, 
  Ticket, 
  BookMarked, 
  Ban, 
  BarChart3, 
  CalendarClock,
  PieChart,
  ShieldCheck,
  User,
  LogOut,
  LogIn,
  Sparkles,
  Wallet
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'routes', label: 'Available Routes', icon: Compass },
    { id: 'search', label: 'Search Routes', icon: Search },
    { id: 'book', label: 'Book Ticket', icon: Ticket },
    { id: 'my-bookings', label: 'My Bookings', icon: BookMarked },
    { id: 'cancel', label: 'Cancel Booking', icon: Ban },
    { id: 'availability', label: 'Seat Availability', icon: PieChart },
    { id: 'schedule', label: 'City Schedule', icon: CalendarClock },
  ];

  if (isAdmin) {
    navItems.push({ id: 'reports', label: 'Financial Reports', icon: BarChart3, isAdminOnly: true });
    navItems.push({ id: 'admin', label: 'Admin Panel', icon: ShieldCheck, isAdminOnly: true });
  }

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-3 cursor-pointer" 
            onClick={() => {
              if (user) {
                setActiveTab('dashboard');
              }
            }}
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 shadow-sm">
              <Bus className="h-5 w-5" />
            </span>
            <div>
              <span className="sb-display text-lg font-bold text-indigo-950 tracking-tight block leading-none">
                SmartBus <span className="text-indigo-600">Express</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Intercity Reservation Portal</span>
            </div>
          </div>

          {/* Right Header: User Profile or Sign In CTA */}
          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-2.5">
                {/* User Wallet Balance Pill */}
                <div 
                  className="flex items-center space-x-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 py-1.5 px-3 rounded-xl text-xs font-bold shadow-2xs"
                  title="Your Available Wallet Balance (Default Rs. 10,000)"
                >
                  <Wallet className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Rs. {(user.balance ?? 10000).toLocaleString()}</span>
                </div>

                <div className="flex items-center space-x-2 bg-slate-50 border border-slate-200 py-1 px-2.5 rounded-xl">
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                    isAdmin ? 'bg-indigo-950 text-amber-300' : 'bg-indigo-950 text-white'
                  }`}>
                    {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight">{user.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isAdmin ? 'text-amber-700' : 'text-slate-500'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center space-x-1 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs (Only rendered when user IS logged in!) */}
        {user && (
          <nav className="flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 animate-in fade-in duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSpecialAdmin = item.isAdminOnly;

              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                    isActive
                      ? isSpecialAdmin
                        ? 'bg-indigo-950 text-amber-300 shadow-xs'
                        : 'bg-indigo-950 text-white shadow-xs'
                      : isSpecialAdmin
                      ? 'text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                  {isSpecialAdmin && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse ml-0.5"></span>
                  )}
                </button>
              );
            })}
          </nav>
        )}
      </div>
    </header>
  );
}
