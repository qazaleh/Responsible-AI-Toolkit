import { reactive } from 'vue';

import { request } from './http';
import { resolveOrigin, runtimeState } from './runtime';

const TOKEN_KEY = 'jhi-authenticationToken';
const ACCOUNT_KEY = 'rai-mfe-account';
const PAGES_KEY = 'rai-mfe-pages';

export const authState = reactive({
  token: '',
  account: null,
  pages: {},
  loading: false,
  lastSyncedAt: null
});

function readStoredToken() {
  return window.localStorage.getItem(TOKEN_KEY) || window.sessionStorage.getItem(TOKEN_KEY) || '';
}

function persistSession({ token, account, pages, rememberMe }) {
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const other = rememberMe ? window.sessionStorage : window.localStorage;

  storage.setItem(TOKEN_KEY, token);
  storage.setItem(ACCOUNT_KEY, JSON.stringify(account || null));
  storage.setItem(PAGES_KEY, JSON.stringify(pages || {}));
  other.removeItem(TOKEN_KEY);
  other.removeItem(ACCOUNT_KEY);
  other.removeItem(PAGES_KEY);
}

function clearSession() {
  [window.localStorage, window.sessionStorage].forEach(storage => {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(ACCOUNT_KEY);
    storage.removeItem(PAGES_KEY);
  });
}

function applySession({ token, account, pages }) {
  authState.token = token || '';
  authState.account = account || null;
  authState.pages = pages || {};
  authState.lastSyncedAt = new Date().toISOString();
}

async function fetchAccount() {
  return request(`${runtimeState.backendUrl}/account`);
}

async function fetchPages(role) {
  if (!role) {
    return {};
  }

  const response = await request(`${runtimeState.authorityApi}?role=${encodeURIComponent(role)}`);
  return response?.pages || {};
}

export async function initializeAuth() {
  const token = readStoredToken();
  if (!token) {
    return;
  }

  const storedAccount = window.localStorage.getItem(ACCOUNT_KEY) || window.sessionStorage.getItem(ACCOUNT_KEY);
  const storedPages = window.localStorage.getItem(PAGES_KEY) || window.sessionStorage.getItem(PAGES_KEY);

  applySession({
    token,
    account: storedAccount ? JSON.parse(storedAccount) : null,
    pages: storedPages ? JSON.parse(storedPages) : {}
  });
}

export async function login(credentials) {
  authState.loading = true;

  try {
    const response = await request(`${runtimeState.backendUrl}/authenticate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: credentials.username,
        cred: credentials.cred,
        rememberMe: Boolean(credentials.rememberMe)
      })
    });

    const token = response?.id_token;
    if (!token) {
      throw new Error('Authentication failed. Check your credentials.');
    }

    const rememberMe = Boolean(credentials.rememberMe);
    persistSession({ token, account: null, pages: {}, rememberMe });
    applySession({ token });

    const account = await fetchAccount();
    const pages = await fetchPages(account?.authorities?.[0]);

    persistSession({ token, account, pages, rememberMe });
    applySession({ token, account, pages });

    return { account, pages };
  } finally {
    authState.loading = false;
  }
}

export function applyShellBootstrap(payload) {
  if (!payload?.token) {
    return;
  }

  applySession({
    token: payload.token,
    account: payload.account || null,
    pages: payload.pages || {}
  });

  persistSession({
    token: payload.token,
    account: payload.account,
    pages: payload.pages,
    rememberMe: true
  });
}

export function requestBootstrapFromShell() {
  if (window.parent === window) {
    return;
  }

  window.parent.postMessage({ type: 'rai-mfe-request-bootstrap' }, resolveOrigin(runtimeState.shellUrl));
}

export function embeddedModeAllowed(route) {
  return route?.query?.embedded === '1';
}

export async function logout() {
  clearSession();
  applySession({ token: '', account: null, pages: {} });
}
