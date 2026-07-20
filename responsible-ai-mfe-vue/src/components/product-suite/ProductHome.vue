<template>
  <div class="grid gap-5 lg:grid-cols-2">
    <ProductCard
      title="TrustAI-X"
      description="AI model evaluation for LLM and ML systems."
      :icon="BrainCircuit"
      @enter="router.push('/trustai-x')"
    />
    <ProductCard
      title="TrustAI-UX"
      description="AI agent evaluation with log and API analysis."
      :icon="Workflow"
      @enter="router.push('/trustai-ux')"
    />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { BrainCircuit, Workflow } from 'lucide-vue-next';

import ProductCard from './ProductCard.vue';

const router = useRouter();
</script>
