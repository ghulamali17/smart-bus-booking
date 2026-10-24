# SmartBus Express — Intercity Bus Reservation System

SmartBus Express is an intercity bus booking and reservation management platform. The project provides an end-to-end digital travel experience, comprising a modern **React + Vite** frontend, a **Node.js + Express** REST API powered by **Prisma ORM** and **PostgreSQL**, and a standalone **Python 3 CLI** application implementing core reservation logic.

---

## 1. System Architecture

The solution is structured into three self-contained components:

```text
smart-bus-booking/
├── backend/                       # REST API (Node.js, Express, Prisma ORM, PostgreSQL)
│   ├── prisma/
│   │   └── schema.prisma          # Database schema & model definitions
│   ├── db.js                      # Prisma client instance & auto-seed routines
│   ├── server.js                  # API routes, JWT authentication & transactions
│   ├── package.json               # Backend dependencies & Prisma scripts
│   └── .env                       # Database connection string & JWT secret
│
├── frontend/                      # Web Application (React 18, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── components/            # Dashboards, Booking, Routes, Reports, Schedule
│   │   ├── context/               # AuthContext (session persistence & role management)
│   │   ├── utils/                 # PDF Boarding Pass generator (jsPDF)
│   │   ├── api.js                 # Unified backend API service client
│   │   └── index.css              # Custom typography tokens & theme styles
│   └── package.json               # Frontend dependencies & build scripts
│
├── python/                        # Standalone Python 3 Console Application
│   └── main.py                    # Interactive CLI application (Pure Python, zero deps)
│
├── Smart_Bus_Reservation_PRD.md   # Product Requirements Document (PRD)
└── test_cases.txt                 # Test matrix & verification scenarios
```

---

## 2. Core Features

### Passenger Portal
- **Interactive Departure Board:** Browse active intercity routes across Karachi, Hyderabad, Sukkur, Mirpur Khas, and Lahore with real-time seat availability.
- **Search & Filters:** Search by Route ID (e.g., `R101`) or origin/destination city with instant filtering.
- **Seat Reservation:** Book tickets with passenger details, seat count selection, and dynamic fare calculation.
- **Instant Boarding Pass Download:** Direct client-side PDF ticket generation (via `jsPDF`) complete with passenger details, route badge, boarding time, seat count, and unique barcode.
- **Booking Management:** Review confirmed bookings and cancel trips with automatic seat restoration.

### Administrator Command Center
- **Fleet & Route Operations:** Add new scheduled coach routes, adjust ticket pricing, and update departure timetables.
- **Master Bookings Registry:** Audit all passenger reservations across user accounts, with real-time status filtering and search.
- **Financial & Occupancy Analytics:** Track total revenue, fleet capacity utilization, seat fill rate, and active passenger accounts.
- **Booking Cancellation & Seat Restoration:** Cancel bookings and restore seat capacity in atomic database transactions.

### Standalone Python Console Engine (`python/main.py`)
- Independent text-based terminal interface following PRD specifications.
- Implements route browsing, search, ticket reservations, cancellation, seat availability gauges, business reports, and city schedules.
- Operates using built-in Python 3 data structures (lists, dictionaries, sets, tuples) with zero external dependencies.

---

## 3. Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide Icons, jsPDF |
| **Backend API** | Node.js, Express, Prisma ORM, JWT (`jsonwebtoken`), bcryptjs |
| **Database** | PostgreSQL |
| **CLI App** | Python 3 (Standard Library) |
| **Typography** | Bricolage Grotesque, DM Mono, Plus Jakarta Sans |

---

## 4. Default Accounts & Credentials

The database automatically seeds default credentials on initial startup:

| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@smartbus.com` | `admin123` | Full access: route catalog management, master bookings audit, revenue analytics, admin dashboard |
| **Passenger** | `user@smartbus.com` | `user123` | Passenger access: book tickets, view personal booking history, download PDF boarding passes |

> **Note:** Public sign-ups automatically receive standard passenger access. Administrator roles are granted securely from the database or initial seed scripts.

---

## 5. Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **Python** (v3.8 or higher, for CLI)

---

### A. Backend Setup (Node.js + Prisma ORM + PostgreSQL)

1. Open a terminal and navigate to `backend/`:
   ```bash
   cd d:\smart-bus-booking\backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your database connection in `backend/.env`:
   ```env
   PORT=5000
   JWT_SECRET=smart_bus_booking_super_secret_jwt_key_2026
   DATABASE_URL="postgresql://postgres:your_password@localhost:5432/smart_bus_booking"
   ```

4. Push the Prisma schema to your PostgreSQL database:
   ```bash
   npm run prisma:push
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server starts on `http://localhost:5000` and verifies PostgreSQL connection via Prisma.*

---

### B. Frontend Setup (React + Vite)

1. Open a new terminal and navigate to `frontend/`:
   ```bash
   cd d:\smart-bus-booking\frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will open at `http://localhost:3000` (or `http://localhost:5173`).*

4. Build for production:
   ```bash
   npm run build
   ```

---

### C. Running the Python CLI Application

1. Open a terminal and navigate to `python/`:
   ```bash
   cd d:\smart-bus-booking\python
   ```

2. Run the application:
   ```bash
   python main.py
   ```

3. Navigate using the menu options:
   ```text
   ========================================
         SMART BUS RESERVATION SYSTEM      
   ========================================
   1. View Available Routes
   2. Search for a Route
   3. Book a Ticket
   4. View My Bookings
   5. Cancel a Booking
   6. View Seat Availability
   7. Generate Booking Report
   8. Display Route Schedule
   9. Exit
   ========================================
   Enter your choice (1-9):
   ```

---

## 6. Initial Route Catalog

| Route ID | Origin | Destination | Departure Time | Ticket Fare | Total Capacity | Available Seats |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **R101** | Karachi | Hyderabad | 08:00 AM | Rs. 1,200 | 40 seats | 40 seats |
| **R102** | Karachi | Sukkur | 09:30 AM | Rs. 2,000 | 36 seats | 36 seats |
| **R103** | Hyderabad | Mirpur Khas | 11:00 AM | Rs. 800 | 32 seats | 32 seats |
| **R104** | Karachi | Lahore | 07:00 PM | Rs. 5,000 | 45 seats | 45 seats |
| **R105** | Sukkur | Hyderabad | 02:00 PM | Rs. 1,500 | 30 seats | 30 seats |

---

## 7. REST API Reference

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | System status and Prisma ORM database connection check |
| `POST` | `/api/auth/register` | Public | Register a new passenger account |
| `POST` | `/api/auth/login` | Public | Authenticate user and issue JWT bearer token |
| `GET` | `/api/auth/me` | Authenticated | Fetch authenticated user profile |
| `GET` | `/api/routes` | Public | List all scheduled routes |
| `GET` | `/api/routes/:id` | Public | Fetch route details by Route ID |
| `POST` | `/api/routes` | Admin | Create a new bus route |
| `PUT` | `/api/routes/:id` | Admin | Update route timetable, fare, or capacity |
| `DELETE` | `/api/routes/:id` | Admin | Delete a route |
| `GET` | `/api/bookings` | Authenticated | List current user's bookings (or all if admin) |
| `POST` | `/api/bookings` | Authenticated | Reserve tickets with atomic seat decrement transaction |
| `POST` | `/api/bookings/:id/cancel` | Authenticated | Cancel booking and restore seat capacity in atomic transaction |
| `GET` | `/api/admin/bookings` | Admin | Master audit registry of all user bookings |
| `DELETE` | `/api/bookings/reset` | Admin | Reset all bookings and restore fleet capacity |
| `GET` | `/api/admin/stats` | Admin | Executive metrics (revenue, occupancy rate, user counts) |
| `GET` | `/api/admin/users` | Admin | List all registered accounts |
| `GET` | `/api/reports` | Public | Aggregated revenue and route performance report |
| `GET` | `/api/schedule` | Public | Network schedule grouped by departure hub |

---

## 8. Verification & Test Matrix

Acceptance testing scenarios can be validated across both the Python CLI and Web application:

| Test ID | Scenario | Input / Action | Expected Result |
|:---:|---|---|---|
| **TC-01** | View All Routes | Option 1 / Catalog View | Displays all 5 starter routes with fares, departure times, and seat capacity |
| **TC-02** | Search by City | Query: `hyderabad` | Returns routes departing from or arriving at Hyderabad |
| **TC-03** | Search Unknown | Query: `atlantis` | Returns "No routes found" message without crashing |
| **TC-04** | Book Valid Ticket | Ahmed, Age 24, R101, 2 seats | Booking confirmed for Rs. 2,400; available seats decrement by 2 |
| **TC-05** | Zero / Negative Seats | Seats: `0` or `-1` | Rejected with validation error; no seat modification |
| **TC-06** | Overbooking | Seats > Available | Request rejected; seats cannot drop below 0 |
| **TC-07** | Cancel Booking | ID: `B1001` | Status changes to `Cancelled`; seats are restored to the route |
| **TC-08** | Double Cancellation | Repeat `B1001` cancellation | Rejected; seats cannot be restored more than once |
| **TC-09** | Report on Empty State | Run report with 0 bookings | Shows 0 bookings and Rs. 0 revenue; route statuses remain accurate |
| **TC-10** | Full Capacity Booking | Book all remaining seats | Route status transitions to `Fully Booked` |
| **TC-11** | Revenue After Cancellation | Cancel booking, then run report | Cancelled ticket fares are excluded from confirmed net revenue |
| **TC-12** | Invalid Input | Non-numeric menu selection | Gracefully handled with an error message; returns to menu |
