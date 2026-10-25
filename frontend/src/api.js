const getApiBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl && !envUrl.includes('your-backend-deployment')) {
    const raw = envUrl.trim().replace(/\/+$/, '');
    return raw.endsWith('/api') ? raw : `${raw}/api`;
  }
  return import.meta.env.PROD
    ? 'https://smart-bus-booking-wine.vercel.app/api'
    : 'http://localhost:5000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper to get auth headers
function getAuthHeaders() {
  const token = localStorage.getItem('smartbus_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

// -----------------------------------------------------------------------------
// Authentication APIs
// -----------------------------------------------------------------------------

export async function apiLogin(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Login failed');
  return data;
}

export async function apiRegister(name, email, password, role = 'user') {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, role }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Registration failed');
  return data;
}

export async function apiGetMe() {
  const res = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to fetch current user profile');
  return data.user;
}

// -----------------------------------------------------------------------------
// Routes APIs (Public read, Admin manage)
// -----------------------------------------------------------------------------

export async function apiGetRoutes() {
  const res = await fetch(`${API_BASE_URL}/routes`);
  if (!res.ok) throw new Error('Failed to fetch routes');
  return await res.json();
}

export async function apiAdminAddRoute(routeData) {
  const res = await fetch(`${API_BASE_URL}/routes`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(routeData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to add route');
  return data;
}

export async function apiAdminUpdateRoute(routeId, routeData) {
  const res = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(routeData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update route');
  return data;
}

export async function apiAdminDeleteRoute(routeId) {
  const res = await fetch(`${API_BASE_URL}/routes/${routeId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete route');
  return data;
}

// -----------------------------------------------------------------------------
// Bookings APIs
// -----------------------------------------------------------------------------

export async function apiGetBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch bookings');
  return await res.json();
}

export async function apiBookTicket(bookingData) {
  const res = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(bookingData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to book ticket');
  return data;
}

export async function apiCancelBooking(bookingId) {
  const res = await fetch(`${API_BASE_URL}/bookings/${bookingId}/cancel`, {
    method: 'POST',
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to cancel booking');
  return data;
}

// -----------------------------------------------------------------------------
// Admin Analytics & Management APIs
// -----------------------------------------------------------------------------

export async function apiAdminGetBookings() {
  const res = await fetch(`${API_BASE_URL}/admin/bookings`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch admin bookings');
  return await res.json();
}

export async function apiAdminGetStats() {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch admin stats');
  return await res.json();
}

export async function apiAdminGetUsers() {
  const res = await fetch(`${API_BASE_URL}/admin/users`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to fetch registered users');
  return await res.json();
}

export async function apiResetBookings() {
  const res = await fetch(`${API_BASE_URL}/bookings/reset`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to reset bookings');
  return await res.json();
}
