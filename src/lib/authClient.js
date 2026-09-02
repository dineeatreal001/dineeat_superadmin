const TOKEN_KEY = "superAdminToken";
const ADMIN_KEY = "superAdminInfo";
const EXPIRY_KEY = "superAdminTokenExpiry";

export const saveSession = (token, superAdmin, expiresInHours = 12) => {
  const expiryTime = Date.now() + expiresInHours * 60 * 60 * 1000;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ADMIN_KEY, JSON.stringify(superAdmin));
  localStorage.setItem(EXPIRY_KEY, String(expiryTime));
};

export const clearSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ADMIN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
};

export const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getAdminInfo = () => {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_KEY);
  return raw ? JSON.parse(raw) : null;
};

// Returns true only if a token exists AND hasn't passed its stored expiry.
// This is a client-side convenience check only — the server still verifies
// the token's real signature/expiry on every protected request.
export const isSessionValid = () => {
  const token = getToken();
  const expiry = localStorage.getItem(EXPIRY_KEY);

  if (!token || !expiry) return false;

  if (Date.now() > Number(expiry)) {
    clearSession();
    return false;
  }

  return true;
};

// Wrapper around fetch that auto-attaches the token and
// auto-clears session on 401 (expired/invalid/tampered token)
export const authFetch = async (url, options = {}) => {
  const token = getToken();

  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });

  if (res.status === 401) {
    clearSession();
    if (typeof window !== "undefined") {
      window.location.href = "/"; // back to login
    }
  }

  return res;
};