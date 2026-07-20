import { computed, reactive } from 'vue';

import { request } from './http';
import { runtimeConfig } from './runtime';

const TOKEN_KEY = 'jhi-authenticationToken';
const ACCOUNT_KEY = 'rai-shell-account';
const PAGES_KEY = 'rai-shell-pages';

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
  return request(`${runtimeConfig.serverApiUrl}/account`);
}

async function fetchPages(role) {
  if (!role) {
    return {};
  }

  const response = await request(
    `${runtimeConfig.serverApiUrl}/pageauthoritynew?role=${encodeURIComponent(role)}`
  );
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

  try {
    const account = await fetchAccount();
    const pages = await fetchPages(account?.authorities?.[0]);
    const rememberMe = Boolean(window.localStorage.getItem(TOKEN_KEY));

    persistSession({ token, account, pages, rememberMe });
    applySession({ token, account, pages });
  } catch (error) {
    clearSession();
    applySession({ token: '', account: null, pages: {} });
  }
}

export async function login(credentials) {
  authState.loading = true;

  try {
    const response = await request(`${runtimeConfig.serverApiUrl}/authenticate`, {
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

export async function logout() {
  const username = authState.account?.login || '';

  try {
    await request(`${runtimeConfig.serverApiUrl}/logout?username=${encodeURIComponent(username)}`);
  } catch (error) {
    console.warn('Logout request failed', error);
  }

  clearSession();
  applySession({ token: '', account: null, pages: {} });
}

export async function changePassword({ currentPassword, newPassword }) {
  await request(`${runtimeConfig.serverApiUrl}/account/change-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword, newPassword })
  });
}

export async function updateAccount(payload) {
  const rememberMe = Boolean(window.localStorage.getItem(TOKEN_KEY));
  const response = await request(`${runtimeConfig.serverApiUrl}/account`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...authState.account, ...payload })
  });

  authState.account = response || { ...authState.account, ...payload };
  persistSession({ token: authState.token, account: authState.account, pages: authState.pages, rememberMe });

  return authState.account;
}

export const currentUserInitials = computed(() => {
  const firstName = authState.account?.firstName?.trim();
  const lastName = authState.account?.lastName?.trim();
  const login = authState.account?.login?.trim();

  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName[0].toUpperCase();
  }

  if (login) {
    return login[0].toUpperCase();
  }

  return 'U';
});
