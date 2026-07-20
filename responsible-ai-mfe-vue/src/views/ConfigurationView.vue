<template>
  <section class="space-y-6">
    <article class="rai-card p-6">
      <header>
        <h2 class="text-lg font-semibold text-[#0f2b2c]">Moderation Profiles</h2>
        <p class="mt-1 text-sm text-[#305669]/70">
          Configure global safety boundaries for the trust framework
        </p>
      </header>

      <div class="mt-6 grid gap-4 md:grid-cols-2">
        <label class="block">
          <span class="rai-label">Default PII Recognition Level</span>
          <select v-model="config.piiLevel" class="rai-select" @change="handleConfigChange('piiLevel', config.piiLevel)">
            <option value="strict">Strict (High Guardrails)</option>
            <option value="moderate">Moderate</option>
            <option value="loose">Loose (Relaxed Rules)</option>
          </select>
        </label>

        <label class="block">
          <span class="rai-label">Data Sanitization Mode</span>
          <select v-model="config.sanitizationMode" class="rai-select" @change="handleConfigChange('sanitizationMode', config.sanitizationMode)">
            <option value="redact">Redact (Mask with [REDACTED])</option>
            <option value="hash">Hash (SHA-256 Mask)</option>
            <option value="remove">Remove Completely</option>
          </select>
        </label>
      </div>
    </article>

    <article class="rai-card p-6">
      <header class="flex items-center justify-between">
        <div>
          <p class="rai-kicker">Advanced Catalog</p>
          <h3 class="mt-2 text-xl font-semibold text-[#0f2b2c]">Config API snapshot</h3>
        </div>
        <button class="rai-button-secondary h-9" type="button" @click="loadCatalog(true)">
          Refresh catalog
        </button>
      </header>

      <div class="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="entry in sampleEntries"
          :key="entry.name"
          class="rai-card-soft p-4"
        >
          <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">{{ entry.name }}</p>
          <p class="mt-2 break-all text-sm leading-6 text-[#174143]">{{ entry.value }}</p>
        </article>
      </div>
    </article>
  </section>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';

import { catalogEntries, loadCatalog } from '../lib/catalog';
import { request } from '../lib/http';
import { runtimeState } from '../lib/runtime';

const config = reactive({
  piiLevel: 'strict',
  sanitizationMode: 'redact'
});

const sampleEntries = computed(() => catalogEntries.value.slice(0, 9));

async function handleConfigChange(key, value) {
  try {
    await request(`${runtimeState.adminUrl}/api/v1/rai/admin/ConfigApi`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        ...config,
        [key]: value
      })
    });
  } catch (error) {
    console.warn('Failed to update config on server', error);
  }
}

onMounted(() => {
  loadCatalog();
});
</script>
