const TOKEN_KEY = 'jhi-authenticationToken';

export function getStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY) || '';
}

export async function request(url, options = {}) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(url, { ...options, headers });
  const text = await response.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch (error) {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      (data && (data.detail || data.message || data.title)) || `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
