<template>
  <main class="min-h-screen bg-[#faf7f0] text-[#0f2b2c]">
    <header class="sticky top-0 z-40 w-full border-b border-[#e6dece] bg-[#fffdf8]/95 backdrop-blur-md">
      <div class="flex h-14 items-center justify-between px-4 sm:px-6">
        <button class="flex items-center gap-2.5" type="button" @click="goTo(defaultWorkspacePath(authState.pages, authState.account?.authorities || []))">
          <span class="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 shadow-md shadow-indigo-500/20">
            <Shield class="h-5 w-5 text-white" />
          </span>
          <span class="text-lg font-semibold tracking-wide text-[#0f2b2c]">
            TrustAI
            <span class="ml-1 rounded border border-[#e6dece] bg-[#faf7f0] px-1 text-xs font-normal text-[#305669]">
              Responsible AI
            </span>
          </span>
        </button>

        <div class="flex items-center gap-3">
          <div v-if="authState.token" class="hidden items-center gap-3 lg:flex">
            <div class="flex items-center gap-1.5 text-xs text-[#305669]">
              <Layers3 class="h-3.5 w-3.5" />
              <select :value="selectedPortfolio" class="rai-select w-[180px]" @change="handlePortfolioChange($event.target.value)">
                <option value="">Select Portfolio</option>
                <option v-for="portfolio in portfolios" :key="portfolio" :value="portfolio">
                  {{ portfolio }}
                </option>
              </select>
            </div>

            <div v-if="selectedPortfolio" class="flex items-center gap-1.5 text-xs text-[#305669]">
              <Building2 class="h-3.5 w-3.5" />
              <select :value="selectedAccount" class="rai-select w-[180px]" @change="handleAccountChange($event.target.value)">
                <option value="">Select Account</option>
                <option v-for="account in accounts" :key="account" :value="account">
                  {{ account }}
                </option>
              </select>
            </div>
          </div>

          <div class="relative">
            <button class="flex h-8 w-8 items-center justify-center rounded-full border border-[#e6dece] bg-[#fffdf8] font-semibold text-[#305669]" type="button" @click="menuOpen = !menuOpen">
              {{ currentUserInitials }}
            </button>

            <div
              v-if="menuOpen"
              class="absolute right-0 mt-2 w-56 rounded-xl border border-[#e6dece] bg-[#fffdf8] p-2 text-sm text-[#0f2b2c] shadow-sm"
            >
              <div class="border-b border-[#e6dece] px-3 py-2">
                <p class="font-medium">TrustAI User</p>
                <p class="text-xs text-[#305669]/70">{{ authState.account?.email || 'rai.office@trustai.com' }}</p>
              </div>
              <button class="rai-button-ghost mt-2 w-full justify-start px-3 py-2" type="button" @click="openMenuRoute('/settings')">
                <Settings class="h-4 w-4" />
                Settings
              </button>
              <button class="rai-button-ghost w-full justify-start px-3 py-2" type="button" @click="openMenuRoute('/password')">
                <Lock class="h-4 w-4" />
                Change Password
              </button>
              <button class="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-600 transition hover:bg-[#faf7f0]" type="button" @click="handleLogout">
                <LogOut class="h-4 w-4" />
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="flex min-h-[calc(100vh-56px)]">
      <aside class="hidden w-64 shrink-0 border-r border-[#e6dece] bg-[#fffdf8] md:flex md:flex-col">
        <nav class="flex-1 space-y-2 p-4">
          <button
            v-for="item in primaryRoutes"
            :key="item.path"
            :class="[
              'flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium transition',
              route.path === item.path
                ? 'bg-[#faeab1] text-[#0f2b2c]'
                : 'text-[#305669] hover:bg-[#faf7f0] hover:text-[#0f2b2c]'
            ]"
            type="button"
            @click="goTo(item.path)"
          >
            <component :is="resolveIcon(item.pageKey)" class="h-4 w-4" />
            <span>{{ item.label }}</span>
          </button>

          <div v-if="adminRoutes.length" class="pt-3">
            <p class="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#305669]/60">
              Administration
            </p>
            <button
              v-for="item in adminRoutes"
              :key="item.path"
              :class="[
                'flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium transition',
                route.path === item.path
                  ? 'bg-[#faeab1] text-[#0f2b2c]'
                  : 'text-[#305669] hover:bg-[#faf7f0] hover:text-[#0f2b2c]'
              ]"
              type="button"
              @click="goTo(item.path)"
            >
              <component :is="resolveIcon(item.pageKey)" class="h-4 w-4" />
              <span>{{ item.label }}</span>
            </button>
          </div>

          <div v-if="secondaryRoutes.length" class="pt-3">
            <p class="px-4 pb-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-[#305669]/60">
              More Tools
            </p>
            <button
              v-for="item in secondaryRoutes"
              :key="item.path"
              :class="[
                'flex w-full items-center gap-3 rounded-md px-4 py-2.5 text-left text-sm font-medium transition',
                route.path === item.path
                  ? 'bg-[#faeab1] text-[#0f2b2c]'
                  : 'text-[#305669] hover:bg-[#faf7f0] hover:text-[#0f2b2c]'
              ]"
              type="button"
              @click="goTo(item.path)"
            >
              <component :is="resolveIcon(item.pageKey)" class="h-4 w-4" />
              <span>{{ item.label }}</span>
            </button>
          </div>
        </nav>

        <div class="p-4">
          <div class="rounded-lg border border-[#f2d774] bg-[#fff6d6] p-3 text-[11px] leading-relaxed text-[#755b17]">
            <p class="font-semibold">Vue Shell Active</p>
            <p class="mt-1">Embedding the Vue micro frontend while keeping the current toolkit APIs.</p>
          </div>
        </div>
      </aside>

      <section class="flex-1 overflow-y-auto bg-[#faf7f0] p-6">
        <div class="mx-auto w-full max-w-6xl space-y-8 pb-8">
          <div class="flex flex-col gap-4 border-b border-[#e6dece] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-[#0f2b2c]">
                {{ activeRoute?.label || 'Responsible AI Workspace' }}
              </h1>
              <p class="mt-1 text-sm text-[#305669]/70">
                {{ activeRoute?.summary || 'Connected to the Vue micro frontend and existing toolkit services.' }}
              </p>
            </div>

            <div v-if="selectedPortfolio" class="rai-status-pill">
              <span class="h-1.5 w-1.5 rounded-full bg-indigo-500" />
              <span class="text-[#305669]/70">Context:</span>
              <span class="font-semibold text-indigo-400">{{ selectedPortfolio }}</span>
              <template v-if="selectedAccount">
                <span class="text-[#c5ba9b]">/</span>
                <span>{{ selectedAccount }}</span>
              </template>
            </div>
            <div v-else class="inline-flex items-center gap-2 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs text-indigo-400">
              <Info class="h-3.5 w-3.5" />
              <span>Select Portfolio/Account to link safety rules</span>
            </div>
          </div>

          <section class="rai-card overflow-hidden">
            <div class="flex items-center justify-between border-b border-[#e6dece] px-5 py-3 text-sm text-[#305669]">
              <div class="flex items-center gap-2">
                <LayoutPanelTop class="h-4 w-4 text-indigo-400" />
                <span>Embedded Vue Micro Frontend</span>
              </div>
              <div class="flex items-center gap-2">
                <button class="rai-button-secondary h-9" type="button" @click="refreshFrame">
                  Refresh
                </button>
                <a
                  :href="iframeSrc"
                  class="inline-flex items-center gap-2 text-[#305669] transition hover:text-[#0f2b2c]"
                  rel="noreferrer"
                  target="_blank"
                >
                  Open standalone
                  <ExternalLink class="h-4 w-4" />
                </a>
              </div>
            </div>

            <div class="relative">
              <div
                v-if="!iframeReady"
                class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-[#fffdf8]/90 text-[#305669]/70"
              >
                <div class="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
                <p class="text-xs font-medium uppercase tracking-[0.32em] text-[#305669]/60">
                  Synchronizing modules...
                </p>
              </div>

              <iframe
                ref="iframeRef"
                :key="iframeKey"
                :src="iframeSrc"
                class="h-[calc(100vh-12rem)] min-h-[760px] w-full bg-[#fffdf8]"
                title="Responsible AI Vue MFE"
                @load="handleIframeLoad"
              />
            </div>
          </section>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import {
  Blocks,
  Building2,
  Cpu,
  ExternalLink,
  FileText,
  Info,
  LayoutPanelTop,
  Layers3,
  Lock,
  LogOut,
  MessageSquareWarning,
  Radar,
  Scale,
  Settings,
  Shield,
  Sparkles,
  Swords,
  Users
} from 'lucide-vue-next';

import { authState, currentUserInitials, logout } from '../lib/auth';
import { defaultWorkspacePath, resolveAccessibleRoutes } from '../lib/navigation';
import { resolveOrigin, runtimeConfig } from '../lib/runtime';
import { request } from '../lib/http';

const route = useRoute();
const router = useRouter();
const iframeRef = ref(null);
const iframeReady = ref(false);
const iframeKey = ref(0);
const menuOpen = ref(false);
const targetOrigin = resolveOrigin(runtimeConfig.mfeUrl);

const accountDetails = ref([]);
const selectedPortfolio = ref(window.localStorage.getItem('selectedPortfolio') || '');
const selectedAccount = ref(window.localStorage.getItem('selectedAccount') || '');
const portfolios = ref([]);

const accessibleRoutes = computed(() =>
  resolveAccessibleRoutes(authState.pages, authState.account?.authorities || [])
);

const primaryRoutes = computed(() =>
  accessibleRoutes.value.filter(item => item.group === 'primary')
);
const adminRoutes = computed(() =>
  accessibleRoutes.value.filter(item => item.group === 'admin')
);
const secondaryRoutes = computed(() =>
  accessibleRoutes.value.filter(item => item.group === 'secondary')
);

const activeRoute = computed(() => {
  return (
    accessibleRoutes.value.find(item => item.path === route.path) ||
    accessibleRoutes.value.find(item => route.path.startsWith(`${item.path}/`)) ||
    accessibleRoutes.value[0]
  );
});

const accounts = computed(() => {
  if (!selectedPortfolio.value) {
    return [];
  }

  return accountDetails.value
    .filter(detail => detail.portfolio === selectedPortfolio.value)
    .map(detail => detail.account);
});

const childPath = computed(() => {
  const matchedPath = route.path.replace(/^\/responsible-ui/, '') || '/workbench';
  return matchedPath.startsWith('/') ? matchedPath : `/${matchedPath}`;
});

const iframeSrc = computed(() => {
  const suffix = new URLSearchParams({ embedded: '1' }).toString();
  return `${runtimeConfig.mfeUrl}/#${childPath.value}?${suffix}`;
});

function resolveIcon(pageKey) {
  const iconMap = {
    Workbench: Sparkles,
    Usecase: Blocks,
    Models: Cpu,
    'LLM-Benchmarking': Radar,
    'Admin Configuration': Settings,
    'User Management': Users,
    'AI-Content-Detector': MessageSquareWarning,
    Document: FileText,
    RedTeaming: Swords,
    ComplianceCheck: Scale
  };

  return iconMap[pageKey] || Sparkles;
}

function bootstrapPayload() {
  return {
    type: 'rai-shell-bootstrap',
    payload: {
      token: authState.token,
      account: authState.account,
      pages: authState.pages,
      route: childPath.value,
      issuedAt: new Date().toISOString(),
      config: {
        backendUrl: runtimeConfig.serverApiUrl,
        adminUrl: runtimeConfig.adminUrl,
        masterUrl: runtimeConfig.masterUrl,
        shellUrl: runtimeConfig.frontendUrl,
        telemetryDashboard: runtimeConfig.telemetryDashboard
      }
    }
  };
}

function sendBootstrap() {
  if (!iframeRef.value?.contentWindow) {
    return;
  }

  iframeRef.value.contentWindow.postMessage(
    bootstrapPayload(),
    targetOrigin === '*' ? '*' : targetOrigin
  );
}

function handleIframeLoad() {
  iframeReady.value = true;
  sendBootstrap();
}

function handleShellMessage(event) {
  if (!event?.data?.type) {
    return;
  }

  if (event.data.type === 'rai-mfe-request-bootstrap') {
    sendBootstrap();
  }

  if (event.data.type === 'rai-mfe-navigate' && event.data.payload?.path) {
    const targetPath = `/responsible-ui${event.data.payload.path}`;
    if (targetPath !== route.path) {
      router.push(targetPath);
    }
  }
}

async function loadAccountDetails() {
  try {
    const response = await request(`${runtimeConfig.adminUrl}/api/v1/rai/admin/getAccount`);
    const details = Array.isArray(response?.[0]?.AccountDetails) ? response[0].AccountDetails : [];
    accountDetails.value = details;
    portfolios.value = [...new Set(details.map(detail => detail.portfolio))];
  } catch (error) {
    const fallback = [
      { portfolio: 'Financial Services', account: 'Investment Banking' },
      { portfolio: 'Financial Services', account: 'Wealth Management' },
      { portfolio: 'Healthcare Systems', account: 'Clinical Analytics' },
      { portfolio: 'Healthcare Systems', account: 'Medical Imaging' },
      { portfolio: 'Retail & Commerce', account: 'E-Commerce Recommendation' }
    ];
    accountDetails.value = fallback;
    portfolios.value = [...new Set(fallback.map(detail => detail.portfolio))];
  }
}

function notifyContextChange() {
  window.dispatchEvent(new Event('storage'));
}

function handlePortfolioChange(value) {
  selectedPortfolio.value = value;
  window.localStorage.setItem('selectedPortfolio', value);

  const firstAccount = accountDetails.value.find(detail => detail.portfolio === value)?.account || '';
  selectedAccount.value = firstAccount;

  if (firstAccount) {
    window.localStorage.setItem('selectedAccount', firstAccount);
  } else {
    window.localStorage.removeItem('selectedAccount');
  }

  notifyContextChange();
}

function handleAccountChange(value) {
  selectedAccount.value = value;

  if (value) {
    window.localStorage.setItem('selectedAccount', value);
  } else {
    window.localStorage.removeItem('selectedAccount');
  }

  notifyContextChange();
}

function goTo(path) {
  menuOpen.value = false;
  router.push(path);
}

function openMenuRoute(path) {
  menuOpen.value = false;
  router.push(path);
}

async function handleLogout() {
  menuOpen.value = false;
  await logout();
  router.replace('/login');
}

function refreshFrame() {
  iframeReady.value = false;
  iframeKey.value += 1;
}

watch(
  () => [route.path, authState.token, authState.lastSyncedAt],
  async () => {
    iframeReady.value = false;
    await nextTick();
    sendBootstrap();
  }
);

watch(
  accessibleRoutes,
  routes => {
    if (!routes.length) {
      return;
    }

    if (route.path === '/responsible-ui' || route.path === '/responsible-ui/') {
      router.replace(defaultWorkspacePath(authState.pages, authState.account?.authorities || []));
    }
  },
  { immediate: true }
);

onMounted(() => {
  loadAccountDetails();
  window.addEventListener('message', handleShellMessage);
  document.addEventListener('click', handleDocumentClick);
});

onUnmounted(() => {
  window.removeEventListener('message', handleShellMessage);
  document.removeEventListener('click', handleDocumentClick);
});

function handleDocumentClick(event) {
  const trigger = event.target?.closest?.('.relative');
  if (!trigger) {
    menuOpen.value = false;
  }
}
</script>
