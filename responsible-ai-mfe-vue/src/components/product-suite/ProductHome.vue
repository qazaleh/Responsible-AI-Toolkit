<template>
  <div class="grid gap-5 lg:grid-cols-2">
    <ProductCard
      title="TrustAI-X"
      description="AI model evaluation for LLM and ML systems."
      :icon="BrainCircuit"
      @enter="openProduct('/trustai-x')"
    />
    <ProductCard
      title="TrustAI-UX"
      description="AI agent evaluation with log and API analysis."
      :icon="Workflow"
      @enter="openProduct('/trustai-ux')"
    />
  </div>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { BrainCircuit, Workflow } from 'lucide-vue-next';

import ProductCard from './ProductCard.vue';

const route = useRoute();
const router = useRouter();

function openProduct(path) {
  router.push({
    path,
    query: { ...route.query }
  });
}
</script>
