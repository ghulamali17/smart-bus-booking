import React, { useState } from 'react';
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
  Wallet,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ activeTab, setActiveTab, onOpenAuth }) {
  const { user, logout, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Admin sees ONLY the last two management tabs; Passengers see customer tabs
  const navItems = isAdmin
    ? [
        { id: 'reports', label: 'Financial Reports', icon: BarChart3, isAdminOnly: true },
        { id: 'admin', label: 'Admin Panel', icon: ShieldCheck, isAdminOnly: true },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'routes', label: 'Available Routes', icon: Compass },
        { id: 'search', label: 'Search Routes', icon: Search },
        { id: 'book', label: 'Book Ticket', icon: Ticket },
        { id: 'my-bookings', label: 'My Bookings', icon: BookMarked },
        { id: 'cancel', label: 'Cancel Booking', icon: Ban },
        { id: 'availability', label: 'Seat Availability', icon: PieChart },
        { id: 'schedule', label: 'City Schedule', icon: CalendarClock },
      ];

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div 
            className="flex items-center space-x-2.5 sm:space-x-3 cursor-pointer shrink-0" 
            onClick={() => {
              if (user) {
                setActiveTab(isAdmin ? 'admin' : 'dashboard');
              }
            }}
          >
            <span className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 shadow-sm shrink-0">
              <Bus className="h-4 w-4 sm:h-5 sm:w-5" />
            </span>
            <div>
              <span className="sb-display text-base sm:text-lg font-bold text-indigo-950 tracking-tight block leading-none">
                SmartBus <span className="text-indigo-600">Express</span>
              </span>
              <span className="hidden sm:block text-[11px] text-slate-500 font-medium">Intercity Reservation Portal</span>
            </div>
          </div>

          {/* Right Header: User Profile, Wallet, Mobile Menu Toggle */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {user ? (
              <div className="flex items-center space-x-1.5 sm:space-x-2.5">
                {/* User Wallet Balance Pill (Passengers only) */}
                {!isAdmin && (
                  <div 
                    className="flex items-center space-x-1 sm:space-x-1.5 bg-emerald-50 text-emerald-900 border border-emerald-200 py-1 px-2 sm:py-1.5 sm:px-3 rounded-xl text-[11px] sm:text-xs font-bold shadow-2xs whitespace-nowrap"
                    title="Your Available Wallet Balance"
                  >
                    <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-600 shrink-0" />
                    <span>Rs. {(user.balance ?? 10000).toLocaleString()}</span>
                  </div>
                )}

                {/* User Badge */}
                <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-50 border border-slate-200 py-1 px-2 sm:px-2.5 rounded-xl">
                  <div className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-[11px] sm:text-xs font-bold shrink-0 ${
                    isAdmin ? 'bg-indigo-950 text-amber-300' : 'bg-indigo-950 text-white'
                  }`}>
                    {user.name ? user.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                  <div className="hidden md:block text-left">
                    <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[100px]">{user.name}</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider block ${
                      isAdmin ? 'text-amber-700' : 'text-slate-500'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                {/* Sign Out Button */}
                <button
                  onClick={logout}
                  className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center space-x-1 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>

                {/* Mobile Hamburger Toggle */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-1.5 rounded-xl text-slate-700 hover:text-indigo-950 hover:bg-slate-100 border border-slate-200 transition-colors"
                  aria-label="Toggle navigation menu"
                >
                  {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={onOpenAuth}
                  className="px-3.5 sm:px-4 py-2 rounded-xl bg-indigo-950 hover:bg-indigo-800 text-white font-bold text-xs shadow-sm flex items-center space-x-1.5 transition-all whitespace-nowrap"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In / Register</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Desktop & Scrollable Navigation Tabs (Logged in) */}
        {user && (
          <nav className="hidden md:flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 animate-in fade-in duration-150">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSpecialAdmin = item.isAdminOnly;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
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

        {/* Mobile Horizontal Quick-Scroll Strip */}
        {user && !mobileMenuOpen && (
          <div className="md:hidden flex space-x-1 overflow-x-auto py-2 scrollbar-none border-t border-slate-100 -mx-4 px-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isSpecialAdmin = item.isAdminOnly;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectTab(item.id)}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? isSpecialAdmin
                        ? 'bg-indigo-950 text-amber-300 shadow-xs'
                        : 'bg-indigo-950 text-white shadow-xs'
                      : 'text-slate-600 bg-slate-50 border border-slate-100'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Mobile Full Menu Dropdown / Drawer */}
        {user && mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-1 animate-in slide-in-from-top-2 duration-150">
            <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Navigation Menu
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                const isSpecialAdmin = item.isAdminOnly;

                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                      isActive
                        ? isSpecialAdmin
                          ? 'bg-indigo-950 text-amber-300 shadow-xs'
                          : 'bg-indigo-950 text-white shadow-xs'
                        : isSpecialAdmin
                        ? 'text-amber-900 bg-amber-50 border border-amber-200'
                        : 'text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
