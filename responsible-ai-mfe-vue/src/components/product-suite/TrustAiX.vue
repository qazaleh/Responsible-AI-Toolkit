<template>
  <div class="space-y-5">
    <PageHeader
      label="TrustAI-X"
      title="AI Model Evaluation Platform"
      description="Run LLM and ML model evaluation workflows across explainability, fairness, robustness, and counterfactuals."
      :icon="BrainCircuit"
    />

    <div class="space-y-5">
      <div class="ps-tab-list">
        <button
          type="button"
          class="ps-tab-trigger"
          :class="{ 'ps-tab-trigger-active': activeTab === 'llm' }"
          @click="activeTab = 'llm'"
        >
          LLM Evaluation
        </button>
        <button
          type="button"
          class="ps-tab-trigger"
          :class="{ 'ps-tab-trigger-active': activeTab === 'ml' }"
          @click="activeTab = 'ml'"
        >
          ML Model Evaluation
        </button>
      </div>

      <LlmEvaluation v-if="activeTab === 'llm'" @notify="message => $emit('notify', message)" />
      <MlEvaluation v-else @notify="message => $emit('notify', message)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { BrainCircuit } from 'lucide-vue-next';

import LlmEvaluation from './LlmEvaluation.vue';
import MlEvaluation from './MlEvaluation.vue';
import PageHeader from './PageHeader.vue';

defineEmits(['notify']);

const activeTab = ref('llm');
</script>
