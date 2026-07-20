<template>
  <section class="space-y-6">
    <article class="rai-card p-6">
      <div class="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p class="rai-kicker">{{ meta.eyebrow }}</p>
          <h2 class="mt-2 text-2xl font-semibold text-[#0f2b2c]">{{ meta.label }}</h2>
          <p class="mt-4 max-w-3xl text-sm leading-7 text-[#305669]/70">
            {{ meta.description || meta.summary }}
            This route stays connected to the existing service catalog while the Vue module follows the new React-inspired design language.
          </p>
        </div>
        <button class="rai-button-secondary" type="button" @click="loadCatalog(true)">
          Refresh service catalog
        </button>
      </div>
    </article>

    <div class="grid gap-6 xl:grid-cols-2">
      <article class="rai-card p-6">
        <header class="flex items-center justify-between">
          <div>
            <p class="rai-kicker">Filtered Endpoints</p>
            <h3 class="mt-2 text-xl font-semibold text-[#0f2b2c]">Relevant service entries</h3>
          </div>
          <PanelTop class="h-5 w-5 text-indigo-400" />
        </header>

        <div class="mt-5 grid gap-3">
          <article
            v-for="entry in filteredEntries"
            :key="entry.name"
            class="rai-card-soft p-4"
          >
            <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">{{ entry.name }}</p>
            <p class="mt-2 break-all text-sm leading-6 text-[#174143]">{{ entry.value }}</p>
          </article>
        </div>
      </article>

      <article class="rai-card p-6">
        <header class="flex items-center justify-between">
          <div>
            <p class="rai-kicker">Operational Notes</p>
            <h3 class="mt-2 text-xl font-semibold text-[#0f2b2c]">What this section is wired to</h3>
          </div>
          <Radar class="h-5 w-5 text-emerald-400" />
        </header>

        <div class="mt-5 grid gap-3">
          <article
            v-for="note in notes"
            :key="note.title"
            class="rai-card-soft p-4"
          >
            <p class="text-sm font-medium text-[#0f2b2c]">{{ note.title }}</p>
            <p class="mt-2 text-sm leading-6 text-[#305669]/70">{{ note.copy }}</p>
          </article>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { PanelTop, Radar } from 'lucide-vue-next';

import { filterCatalogEntries, loadCatalog } from '../lib/catalog';

const route = useRoute();
const meta = computed(() => route.meta || {});
const filteredEntries = computed(() => filterCatalogEntries(meta.value.keywords || []));
const notes = computed(() => [
  {
    title: 'Shared config contract',
    copy: 'Endpoint discovery comes from Admin ConfigApi, matching the current Angular and React parallel runtimes.'
  },
  {
    title: 'Parallel Vue surface',
    copy: 'This section exists independently from the Angular UI so both stacks can run together.'
  },
  {
    title: 'Backend compatibility',
    copy: 'No new backend services were introduced here; the Vue MFE targets the existing module APIs.'
  }
]);

onMounted(() => {
  loadCatalog();
});
</script>
