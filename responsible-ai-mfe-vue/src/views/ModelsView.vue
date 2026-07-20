<template>
  <section class="grid gap-6 md:grid-cols-3">
    <article
      v-for="model in models"
      :key="model.name"
      class="rai-card p-6 transition hover:border-[#d8cda9]"
    >
      <span class="block text-[10px] font-bold uppercase tracking-[0.24em] text-indigo-400">
        {{ model.type }}
      </span>
      <h2 class="mt-2 truncate text-base font-bold text-[#0f2b2c]">{{ model.name }}</h2>

      <div class="mt-5 space-y-3 pt-0 text-xs">
        <div class="flex justify-between">
          <span class="text-[#305669]/70">Precision:</span>
          <span class="font-semibold text-[#174143]">{{ model.precision }}</span>
        </div>
        <div class="flex justify-between">
          <span class="text-[#305669]/70">Footprint:</span>
          <span class="font-semibold text-[#174143]">{{ model.size }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

import { getCatalogValue, loadCatalog } from '../lib/catalog';
import { request } from '../lib/http';
import { joinUrl } from '../lib/urls';
import { authState } from '../lib/auth';

const models = ref([]);

function currentUser() {
  return authState.account?.login || 'admin';
}

function workbenchEndpoint() {
  return joinUrl(getCatalogValue('Workbench'), getCatalogValue('Workbench_Model') || '/v1/workbench/model');
}

onMounted(async () => {
  try {
    await loadCatalog();
    const formData = new FormData();
    formData.append('userId', currentUser());
    const response = await request(workbenchEndpoint(), {
      method: 'POST',
      body: formData
    });

    const source = Array.isArray(response?.ModelDetails)
      ? response.ModelDetails
      : Array.isArray(response)
        ? response
        : [];

    models.value = source.map(item => ({
      name: item.ModelName || 'Unnamed Model',
      type: item.Type || 'Model',
      precision: item.Precision || 'Unknown',
      size: item.Size || 'Unknown'
    }));

    if (!models.value.length) {
      throw new Error('No models returned');
    }
  } catch (error) {
    console.warn('Failed to fetch models', error);
    models.value = [
      { name: 'pii-scrubber-bert-v2', type: 'Privacy Masker', precision: 'FP16', size: '340M params' },
      { name: 'toxicity-guardrail-classifier', type: 'Safety Moderator', precision: 'INT8', size: '110M params' },
      { name: 'legal-contract-compliance-auditor', type: 'Compliance Engine', precision: 'FP32', size: '7B params' }
    ];
  }
});
</script>
