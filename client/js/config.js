/* ============================================================
   API CONFIGURATION
  Use localhost while developing. In production, the API is served from
  the same Vercel project at /api.
   ============================================================ */

const isLocal = window.location.protocol === 'file:'
  || window.location.hostname === 'localhost'
  || window.location.hostname === '127.0.0.1';
const API_BASE_URL = window.NEARBIZ_API_URL || (isLocal ? 'http://localhost:3000' : window.location.origin);

const API = {
  businesses: `${API_BASE_URL}/api/businesses`,
  stats: `${API_BASE_URL}/api/businesses/stats`
};
