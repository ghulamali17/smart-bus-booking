import React, { useMemo, useState } from 'react';
import {
  Bus,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Ticket,
  LogIn,
  UserPlus,
  Download,
  Zap,
  Award,
  RotateCcw,
} from 'lucide-react';

/* -------------------------------------------------------------------------- */
/*  Scoped styles: fonts + one orchestrated entrance                           */
/* -------------------------------------------------------------------------- */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500..800&family=DM+Mono:wght@400;500&display=swap');
.sb-display{font-family:'Bricolage Grotesque',ui-sans-serif,system-ui,sans-serif;letter-spacing:-0.025em}
.sb-mono{font-family:'DM Mono',ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-numeric:tabular-nums}
@keyframes sb-rise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
.sb-rise{animation:sb-rise .55s cubic-bezier(.2,.7,.2,1) both}
@media (prefers-reduced-motion:reduce){.sb-rise{animation:none}.sb-ping{animation:none!important}}
`;

const fmt = (n) => Number(n || 0).toLocaleString();

const scrollToDepartures = () => {
  const el = document.getElementById('departures');
  if (!el) return;
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
};

/* Deterministic barcode-style stripes for the sample pass */
function BarcodeStripes({ seed }) {
  const bars = useMemo(() => {
    const out = [];
    const text = `${seed}-SMARTBUS`;
    for (let r = 0; r < 3; r++) {
      for (const ch of text) {
        const c = ch.charCodeAt(0) + r * 7;
        out.push({ w: 1 + (c % 3), gap: 1 + ((c >> 2) % 2) });
      }
    }
    return out;
  }, [seed]);

  return (
    <div className="flex h-11 items-stretch justify-center overflow-hidden" aria-hidden="true">
      {bars.map((b, i) => (
        <span
          key={i}
          className="bg-indigo-950"
          style={{ width: `${b.w}px`, marginRight: `${b.gap}px` }}
        />
      ))}
    </div>
  );
}

export default function LandingPage({ routes = [], onOpenAuth }) {
  const [city, setCity] = useState('All');

  /* ---------------- Derived data ---------------- */
  const originCities = useMemo(
    () => Array.from(new Set(routes.map((r) => r.departure_city).filter(Boolean))),
    [routes]
  );

  const visibleRoutes = useMemo(
    () => (city === 'All' ? routes : routes.filter((r) => r.departure_city === city)),
    [routes, city]
  );

  const stats = useMemo(() => {
    const cities = new Set(routes.flatMap((r) => [r.departure_city, r.destination_city]).filter(Boolean));
    const prices = routes.map((r) => Number(r.ticket_price)).filter((n) => !Number.isNaN(n) && n > 0);
    return {
      cities: cities.size,
      departures: routes.length,
      seatsOpen: routes.reduce((sum, r) => sum + (Number(r.available_seats) || 0), 0),
      lowestFare: prices.length ? Math.min(...prices) : null,
    };
  }, [routes]);

  const boardRoutes = routes.slice(0, 5);
  const sample =
    routes.find((r) => r.available_seats > 0) ||
    routes[0] || {
      route_id: 'R101',
      departure_city: 'Karachi',
      destination_city: 'Hyderabad',
      departure_time: '08:00 AM',
      ticket_price: 1200,
    };

  const steps = [
    {
      icon: MapPin,
      title: 'Choose a departure',
      text: 'Browse the daily schedule and see how many seats are left on each coach.',
    },
    {
      icon: Ticket,
      title: 'Pick your seats',
      text: 'Enter passenger details and confirm. Your seats are held the moment you book.',
    },
    {
      icon: Download,
      title: 'Download your pass',
      text: 'Save the PDF boarding pass to your phone and show it at the terminal.',
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Seats are counted before you pay',
      text: 'Every request is checked against the coach capacity, so a confirmed seat stays yours.',
    },
    {
      icon: ShieldCheck,
      title: 'A boarding pass you can scan',
      text: 'Download a PDF with your journey details and a barcode. No printing needed.',
    },
    {
      icon: Award,
      title: 'One fare, no add-ons',
      text: 'Ticket prices are fixed per route, with no service charges at checkout.',
    },
    {
      icon: RotateCcw,
      title: 'Cancel and the seat goes back',
      text: 'Cancelling releases your seats right away, so someone else can book them.',
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <div className="space-y-12 sm:space-y-14">
        {/* ===================================================================== */}
        {/* 1. HERO with live departure board                                      */}
        {/* ===================================================================== */}
        <section className="relative overflow-hidden rounded-3xl bg-indigo-950 text-white shadow-2xl ring-1 ring-white/10">
          {/* soft glow + dotted texture */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(60rem 30rem at 85% -10%, rgba(99,102,241,.35), transparent 60%), radial-gradient(rgba(165,180,252,.14) 1px, transparent 1px)',
              backgroundSize: 'auto, 22px 22px',
              WebkitMaskImage: 'linear-gradient(to bottom, #000 40%, transparent 100%)',
              maskImage: 'linear-gradient(to bottom, #000 40%, transparent 100%)',
            }}
          />

          <div className="relative grid items-center gap-8 p-6 sm:p-8 lg:grid-cols-12 lg:gap-8 lg:p-10">
            {/* Left: message */}
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2.5 text-indigo-200">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-300 text-indigo-950 shadow-sm">
                  <Bus className="h-4 w-4" />
                </span>
                <span className="sb-display text-base font-semibold text-white tracking-wide">SmartBus Express</span>
              </div>

              <h1 className="sb-display mt-4 sm:mt-5 text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.12] tracking-tight">
                Know your seat before you reach the terminal.
              </h1>

              <p className="mt-3 sm:mt-4 max-w-xl text-sm sm:text-[15px] leading-relaxed text-indigo-100/80">
                Reserve intercity bus seats between Karachi, Hyderabad, Sukkur, Mirpur Khas and Lahore.
                Seat counts update as people book, so the seat you pick is the seat you get.
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-300 px-5 py-3 text-sm font-bold text-indigo-950 shadow-lg shadow-black/20 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-950"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Sign in to book a seat</span>
                </button>
                <button
                  onClick={onOpenAuth}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
                >
                  <UserPlus className="h-4 w-4 text-indigo-200" />
                  <span>Create a free account</span>
                </button>
              </div>

              <p className="mt-3.5 text-xs text-indigo-200/70">
                Free to join. Your boarding pass downloads as a PDF the moment you book.
              </p>
            </div>

            {/* Right: departure board */}
            <div className="lg:col-span-5">
              <div
                role="region"
                aria-label="Upcoming departures"
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-3.5 border-b border-white/10">
                  <h2 className="sb-display text-base sm:text-lg font-semibold text-white">Departures</h2>
                  <span className="flex items-center gap-1.5 text-xs text-indigo-100/80">
                    <span className="relative flex h-2 w-2">
                      <span className="sb-ping absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                    Live updates
                  </span>
                </div>

                {boardRoutes.length === 0 ? (
                  <p className="px-4 py-6 text-sm text-indigo-100/70">
                    No departures are scheduled yet. Check back soon.
                  </p>
                ) : (
                  <ul className="divide-y divide-white/10">
                    {boardRoutes.map((r, i) => {
                      const full = r.available_seats === 0;
                      const low = !full && r.available_seats <= 5;
                      return (
                        <li
                          key={r.route_id}
                          style={{ animationDelay: `${100 + i * 60}ms` }}
                          className="sb-rise grid grid-cols-[76px_minmax(0,1fr)_auto] items-center gap-2.5 px-4 py-2.5 sm:py-3 text-xs sm:text-sm"
                        >
                          <span className="sb-mono font-medium text-amber-300">{r.departure_time}</span>
                          <div className="min-w-0">
                            <p className="truncate font-semibold text-white">{r.destination_city}</p>
                            <p className="truncate text-[11px] text-indigo-200/70">from {r.departure_city}</p>
                          </div>
                          <span
                            className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${
                              full
                                ? 'bg-rose-500/15 text-rose-200'
                                : low
                                ? 'bg-amber-400/15 text-amber-200'
                                : 'bg-emerald-400/15 text-emerald-200'
                            }`}
                          >
                            {full ? 'Full' : `${r.available_seats} left`}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}

                <button
                  onClick={scrollToDepartures}
                  className="w-full border-t border-white/10 px-4 py-2.5 sm:py-3 text-left text-xs sm:text-sm font-semibold text-amber-300 hover:text-amber-200 transition hover:bg-white/5 focus:outline-none flex items-center justify-between"
                >
                  <span>See every departure</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 2. NETWORK AT A GLANCE (real numbers from the schedule)                */}
        {/* ===================================================================== */}
        <section aria-label="Network summary">
          <dl className="grid grid-cols-2 divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white md:grid-cols-4 md:divide-x md:divide-y-0 shadow-xs">
            {[
              { label: 'Cities connected', value: stats.cities || '-' },
              { label: 'Departures scheduled', value: stats.departures || '-' },
              { label: 'Seats open right now', value: stats.departures ? fmt(stats.seatsOpen) : '-' },
              { label: 'Fares start at', value: stats.lowestFare ? `Rs. ${fmt(stats.lowestFare)}` : '-' },
            ].map((s) => (
              <div key={s.label} className="px-5 py-4 sm:py-5">
                <dd className="sb-display text-2xl sm:text-3xl font-bold text-indigo-950">{s.value}</dd>
                <dt className="mt-1 text-xs sm:text-sm text-slate-500">{s.label}</dt>
              </div>
            ))}
          </dl>
        </section>

        {/* ===================================================================== */}
        {/* 3. DEPARTURES                                                          */}
        {/* ===================================================================== */}
        <section id="departures" className="scroll-mt-6 space-y-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <h2 className="sb-display text-2xl sm:text-3xl font-bold text-indigo-950">
                Choose where you are going
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-600">
                Every departure on the network, with live seat counts. Sign in to reserve.
              </p>
            </div>

            {originCities.length > 1 && (
              <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by departure city">
                {['All', ...originCities].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCity(c)}
                    aria-pressed={city === c}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                      city === c
                        ? 'bg-indigo-950 text-white'
                        : 'bg-white text-slate-600 ring-1 ring-inset ring-slate-200 hover:text-indigo-950 hover:ring-slate-300'
                    }`}
                  >
                    {c === 'All' ? 'All cities' : `From ${c}`}
                  </button>
                ))}
              </div>
            )}
          </div>

          {visibleRoutes.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
              <p className="font-semibold text-indigo-950 text-sm">No departures to show</p>
              <p className="mt-1 text-xs text-slate-500">
                {routes.length === 0
                  ? 'The schedule is empty right now. Check back soon.'
                  : 'Try another departure city.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-200 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
              {visibleRoutes.map((r) => {
                const full = r.available_seats === 0;
                const low = !full && r.available_seats <= 5;
                return (
                  <li
                    key={r.route_id}
                    className="grid grid-cols-2 items-center gap-x-4 gap-y-2.5 px-4 py-3.5 transition-colors hover:bg-slate-50 sm:px-6 md:grid-cols-[100px_minmax(0,1fr)_150px_110px_180px] md:gap-y-0"
                  >
                    <span className="sb-mono order-1 text-base font-semibold text-indigo-950 md:order-none">
                      {r.departure_time}
                    </span>

                    <div className="order-3 col-span-2 min-w-0 md:order-none md:col-span-1">
                      <p className="flex items-center gap-1.5 font-semibold text-slate-900 text-sm">
                        <span className="truncate">{r.departure_city}</span>
                        <ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400" aria-label="to" />
                        <span className="truncate">{r.destination_city}</span>
                      </p>
                      <p className="sb-mono mt-0.5 text-[11px] text-slate-500">Route {r.route_id}</p>
                    </div>

                    <span className="order-4 flex items-center gap-1.5 text-xs md:order-none">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          full ? 'bg-rose-500' : low ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}
                      />
                      <span className={full ? 'text-rose-700 font-semibold' : low ? 'text-amber-700 font-medium' : 'text-slate-600'}>
                        {full ? 'Fully booked' : low ? `Only ${r.available_seats} left` : `${r.available_seats} seats free`}
                      </span>
                    </span>

                    <span className="order-2 text-right font-bold text-sm text-indigo-950 md:order-none md:text-left">
                      Rs. {fmt(r.ticket_price)}
                    </span>

                    <button
                      onClick={onOpenAuth}
                      disabled={full}
                      className={`order-5 inline-flex items-center justify-center gap-1.5 justify-self-end rounded-xl px-4 py-2 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 md:order-none md:w-full ${
                        full
                          ? 'cursor-not-allowed bg-slate-100 text-slate-400'
                          : 'bg-indigo-950 text-white hover:bg-indigo-800 shadow-xs'
                      }`}
                    >
                      <Ticket className="h-3.5 w-3.5" />
                      <span>{full ? 'Fully booked' : 'Sign in to reserve'}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* ===================================================================== */}
        {/* 4. HOW IT WORKS (a true sequence)                                      */}
        {/* ===================================================================== */}
        <section className="space-y-6">
          <h2 className="sb-display max-w-xl text-2xl sm:text-3xl font-bold text-indigo-950">
            From search to boarding in three steps
          </h2>

          <ol className="grid gap-5 md:grid-cols-3 md:gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.title} className="relative bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-amber-300 shadow-xs">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="sb-display text-2xl font-bold text-slate-300">0{i + 1}</span>
                  </div>
                  <h3 className="sb-display text-base sm:text-lg font-bold text-indigo-950">{s.title}</h3>
                  <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-slate-600">{s.text}</p>
                </li>
              );
            })}
          </ol>
        </section>

        {/* ===================================================================== */}
        {/* 5. WHY SMARTBUS + sample boarding pass                                 */}
        {/* ===================================================================== */}
        <section className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white lg:grid-cols-2 shadow-xs">
          <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <h2 className="sb-display text-2xl sm:text-3xl font-bold text-indigo-950">
              Built so the booking you make is the seat you get
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-slate-600">
              Every step is designed for transparency, certainty, and hassle-free travel.
            </p>

            <ul className="mt-6 divide-y divide-slate-100">
              {benefits.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.title} className="flex gap-3.5 py-3.5 first:pt-0 last:pb-0">
                    <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{b.title}</h3>
                      <p className="mt-0.5 text-xs leading-relaxed text-slate-600">{b.text}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Sample pass */}
          <div className="flex flex-col items-center justify-center bg-indigo-950 p-6 sm:p-8 lg:p-10">
            <div className="w-full max-w-xs sm:max-w-sm rounded-2xl bg-white shadow-2xl shadow-black/40 overflow-hidden">
              <div className="flex items-center justify-between bg-indigo-900 px-4 py-3 text-white">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-300 text-indigo-950">
                    <Bus className="h-3.5 w-3.5" />
                  </span>
                  <span className="sb-display text-sm font-bold">SmartBus Express</span>
                </div>
                <span className="sb-mono rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-semibold">{sample.route_id}</span>
              </div>

              <div className="px-4 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">From</p>
                    <p className="sb-display truncate text-base sm:text-lg font-bold text-indigo-950">
                      {sample.departure_city}
                    </p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-indigo-400" />
                  <div className="min-w-0 text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">To</p>
                    <p className="sb-display truncate text-base sm:text-lg font-bold text-indigo-950">
                      {sample.destination_city}
                    </p>
                  </div>
                </div>

                <dl className="mt-3.5 grid grid-cols-3 gap-2 rounded-xl bg-slate-50 p-2.5 text-center border border-slate-100">
                  <div>
                    <dt className="text-[10px] text-slate-500 uppercase font-semibold">Departs</dt>
                    <dd className="sb-mono mt-0.5 text-xs font-bold text-indigo-950">
                      {sample.departure_time}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500 uppercase font-semibold">Seats</dt>
                    <dd className="sb-mono mt-0.5 text-xs font-bold text-indigo-950">1 Seat</dd>
                  </div>
                  <div>
                    <dt className="text-[10px] text-slate-500 uppercase font-semibold">Fare</dt>
                    <dd className="sb-mono mt-0.5 text-xs font-bold text-indigo-950">
                      Rs. {fmt(sample.ticket_price)}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* perforation */}
              <div className="relative my-4">
                <div className="border-t border-dashed border-slate-200" />
                <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-indigo-950" />
                <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-indigo-950" />
              </div>

              <div className="px-4 pb-4">
                <BarcodeStripes seed={sample.route_id} />
                <p className="mt-2 text-center text-[11px] font-bold text-emerald-700 uppercase tracking-wider">Confirmed &amp; Paid</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] text-indigo-200/70">Official Boarding Pass Preview</p>
          </div>
        </section>

        {/* ===================================================================== */}
        {/* 6. CLOSING CALL TO ACTION                                              */}
        {/* ===================================================================== */}
        <section className="rounded-3xl bg-amber-300 p-6 sm:p-8 lg:p-10 text-indigo-950 shadow-md">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="sb-display text-2xl sm:text-3xl font-extrabold leading-tight">
                Your next seat is one sign-in away.
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-indigo-950/80 leading-relaxed">
                Create a free account to reserve seats, follow departures and download your boarding pass.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-950 px-5 py-3 text-xs sm:text-sm font-bold text-white transition hover:bg-indigo-800 shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                <span>Sign in to book</span>
              </button>
              <button
                onClick={onOpenAuth}
                className="inline-flex items-center gap-2 rounded-xl border border-indigo-950/30 px-5 py-3 text-xs sm:text-sm font-bold transition hover:bg-indigo-950/10"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create a free account</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}