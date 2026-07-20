<template>
  <main class="min-h-screen bg-[#faf7f0] text-[#0f2b2c]">
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

    <div v-else class="p-6">
      <RouterView />
    </div>
  </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Orbit } from 'lucide-vue-next';

import { applyShellBootstrap, authState, requestBootstrapFromShell } from '../lib/auth';

const route = useRoute();
const router = useRouter();
const fallbackLoginReady = ref(false);

const embedded = computed(() => route.query.embedded === '1');

function handleShellMessage(event) {
  if (!event?.data?.type) {
    return;
  }

  if (event.data.type === 'rai-shell-bootstrap') {
    applyShellBootstrap(event.data.payload || {});
  }
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
});
</script>
