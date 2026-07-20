<template>
  <div class="mx-auto w-full max-w-7xl">
    <TrustAiX v-if="mode === 'x'" @notify="notify" />
    <TrustAiUx v-else-if="mode === 'ux'" @notify="notify" />
    <ReportsPage v-else-if="mode === 'reports'" />
    <SettingsPage v-else-if="mode === 'settings'" />
    <ProductHome v-else />

    <Toast :message="message" />
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import ProductHome from '../components/product-suite/ProductHome.vue';
import ReportsPage from '../components/product-suite/ReportsPage.vue';
import SettingsPage from '../components/product-suite/SettingsPage.vue';
import Toast from '../components/product-suite/Toast.vue';
import TrustAiUx from '../components/product-suite/TrustAiUx.vue';
import TrustAiX from '../components/product-suite/TrustAiX.vue';

function routeMode(pathname) {
  if (pathname.includes('trustai-ux')) return 'ux';
  if (pathname.includes('reports')) return 'reports';
  if (pathname.includes('configs')) return 'settings';
  if (
    pathname.includes('trustai-x') ||
    pathname.includes('benchmarking') ||
    pathname.includes('models') ||
    pathname.includes('workbench')
  ) {
    return 'x';
  }
  return 'home';
}

const route = useRoute();
const message = ref('');

const mode = computed(() => routeMode(route.path));

function notify(nextMessage) {
  message.value = nextMessage;
  window.setTimeout(() => {
    message.value = '';
  }, 2400);
}
</script>
