<template>
  <main class="min-h-screen bg-transparent text-[#0f2b2c]">
    <div
      v-if="embedded && !authState.token && !fallbackLoginReady"
      class="flex min-h-screen items-center justify-center px-6"
    >
      <section class="rai-card max-w-xl p-8 text-center">
        <Orbit class="mx-auto h-10 w-10 animate-pulse text-indigo-400" />
        <h1 class="mt-5 text-2xl font-semibold text-[#0f2b2c]">Waiting for shell bootstrap</h1>
        <p class="mt-3 text-sm leading-6 text-[#305669]/70">
          The Vue shell is expected to hand off authentication, route state, and runtime
          configuration. If that does not happen, you can still sign in directly.
        </p>
        <button class="rai-button-primary mt-6" type="button" @click="goToDirectLogin">
          Continue with direct sign in
        </button>
      </section>
    </div>

    <div v-else class="flex h-full w-full bg-transparent text-[#0f2b2c]">
      <main class="flex-1 min-w-0 overflow-y-auto">
        <div class="mx-auto w-full max-w-6xl space-y-8 pb-12">
          <div class="flex flex-col gap-4 border-b border-[#e6dece] pb-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 class="text-2xl font-semibold text-[#0f2b2c]">
                {{ activeSection?.title || 'Responsible AI Workspace' }}
              </h1>
              <p class="mt-1 text-sm text-[#305669]/70">
                {{ activeSection?.description || 'Connected to the existing toolkit contracts.' }}
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

          <div class="flex flex-wrap gap-3 overflow-x-auto pb-2">
            <button
              v-for="section in coreSections"
              :key="section.path"
              :class="['rai-tab', route.path === section.path ? 'rai-tab-active' : '']"
              type="button"
              @click="router.push(section.path)"
            >
              {{ section.tabLabel || section.label }}
            </button>
          </div>

          <div v-if="secondarySections.length" class="flex flex-wrap gap-2">
            <button
              v-for="section in secondarySections"
              :key="section.path"
              class="rounded-md border border-[#e6dece] bg-[#fffdf8] px-3 py-1.5 text-xs font-medium text-[#305669] transition hover:bg-[#faf7f0] hover:text-[#0f2b2c]"
              type="button"
              @click="router.push(section.path)"
            >
              {{ section.label }}
            </button>
          </div>

          <section class="animate-in fade-in duration-300">
            <RouterView />
          </section>
        </div>
      </main>

      <div class="fixed bottom-6 right-6 z-40">
        <div
          v-if="assistantOpen"
          class="flex h-96 w-80 flex-col overflow-hidden rounded-xl border border-[#e6dece] bg-[#fffdf8] shadow-sm"
        >
          <header class="flex items-center justify-between bg-indigo-600 px-4 py-3 text-white">
            <span class="flex items-center gap-2 text-sm font-semibold">
              <Shield class="h-4 w-4" />
              TrustAI Guardrail Assistant
            </span>
            <button class="text-xs text-indigo-100 transition hover:text-white" type="button" @click="assistantOpen = false">
              ✕
            </button>
          </header>
          <div class="flex-1 space-y-3 overflow-y-auto p-4 text-xs font-medium text-[#305669]">
            <div class="rounded-lg bg-[#faf7f0] p-3 leading-relaxed">
              Hi! I am your TrustAI safety agent. I can help configure guardrail thresholds or verify PII rules.
            </div>
          </div>
          <div class="flex gap-2 border-t border-[#e6dece] bg-[#fffdf8] p-3">
            <input
              v-model="assistantPrompt"
              class="rai-input h-8.5 text-xs"
              placeholder="Ask safety guidelines..."
              type="text"
            />
            <button class="rai-button-primary h-8.5 px-3 text-xs" type="button">
              Send
            </button>
          </div>
        </div>

        <button
          v-else
          class="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-500"
          type="button"
          @click="assistantOpen = true"
        >
          <MessageCircle class="h-6 w-6" />
        </button>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Info, MessageCircle, Orbit, Shield } from 'lucide-vue-next';

import {
  applyShellBootstrap,
  authState,
  requestBootstrapFromShell
} from '../lib/auth';
import { resolveAccessibleSections, sectionMap } from '../lib/navigation';

const route = useRoute();
const router = useRouter();
const fallbackLoginReady = ref(false);
const assistantOpen = ref(false);
const assistantPrompt = ref('');
const selectedPortfolio = ref(window.localStorage.getItem('selectedPortfolio') || '');
const selectedAccount = ref(window.localStorage.getItem('selectedAccount') || '');

const embedded = computed(() => route.query.embedded === '1');
const activeSection = computed(() => sectionMap[route.path] || null);
const accessibleSections = computed(() =>
  resolveAccessibleSections(authState.pages, authState.account?.authorities || [])
);
const coreSections = computed(() => accessibleSections.value.filter(section => section.core));
const secondarySections = computed(() => accessibleSections.value.filter(section => !section.core));

function handleShellMessage(event) {
  if (!event?.data?.type) {
    return;
  }

  if (event.data.type === 'rai-shell-bootstrap') {
    applyShellBootstrap(event.data.payload || {});
  }
}

function handleStorageChange() {
  selectedPortfolio.value = window.localStorage.getItem('selectedPortfolio') || '';
  selectedAccount.value = window.localStorage.getItem('selectedAccount') || '';
}

function goToDirectLogin() {
  router.replace({
    path: '/login',
    query: {
      redirect: route.fullPath
    }
  });
}

onMounted(() => {
  window.addEventListener('message', handleShellMessage);
  window.addEventListener('storage', handleStorageChange);
  handleStorageChange();

  if (embedded.value && !authState.token) {
    requestBootstrapFromShell();
    window.setTimeout(() => {
      if (!authState.token) {
        fallbackLoginReady.value = true;
      }
    }, 1800);
  }
});

onUnmounted(() => {
  window.removeEventListener('message', handleShellMessage);
  window.removeEventListener('storage', handleStorageChange);
});
</script>
