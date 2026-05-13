/**
 * API URL resolution for CRA + Vercel rewrites.
 * - Production (Vercel): REACT_APP_API_URL=/api → same-origin; rewrites proxy to AWS.
 * - Direct backend: REACT_APP_API_URL=https://host:5000/api
 * - Local default: http://localhost:5000/api when unset.
 */

function trimRaw() {
  const v = process.env.REACT_APP_API_URL;
  if (v == null || v === 'undefined') return '';
  return String(v).trim();
}

/** Axios baseURL (always ends with /api, no trailing slash before path joins). */
export function getAxiosBaseUrl() {
  const raw = trimRaw();
  if (!raw) {
    return 'http://localhost:5000/api';
  }
  if (raw.startsWith('/')) {
    let path = raw.replace(/\/+$/, '');
    if (!path.endsWith('/api')) {
      path = `${path}/api`;
    }
    return path;
  }
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    let u = raw.replace(/\/+$/, '');
    if (!u.endsWith('/api')) {
      u = `${u}/api`;
    }
    return u;
  }
  return 'http://localhost:5000/api';
}

/**
 * Origin for static files served by the backend (/uploads/...).
 * Empty string = same origin as the SPA (use with Vercel rewrites to AWS).
 */
export function getPublicBackendOrigin() {
  const api = getAxiosBaseUrl();
  if (api.startsWith('http://') || api.startsWith('https://')) {
    return api.replace(/\/api\/?$/, '');
  }
  return '';
}
