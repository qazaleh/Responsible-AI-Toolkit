<template>
  <div class="space-y-5">
    <PageHeader
      label="TrustAI-UX"
      title="AI Agent Evaluation Platform"
      description="Evaluate agent executions through uploaded logs or API-integrated activity windows."
      :icon="Workflow"
    />

    <AgentDashboard />

    <div class="space-y-5">
      <div class="ps-tab-list">
        <button
          v-for="tab in tabs"
          :key="tab.value"
          type="button"
          class="ps-tab-trigger"
          :class="{ 'ps-tab-trigger-active': activeTab === tab.value }"
          @click="activeTab = tab.value"
        >
          {{ tab.label }}
        </button>
      </div>

      <AgentsTable v-if="activeTab === 'agents'" @notify="message => $emit('notify', message)" />
      <LogAnalysis v-else-if="activeTab === 'log'" @notify="message => $emit('notify', message)" />
      <ApiAnalysis v-else @notify="message => $emit('notify', message)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Workflow } from 'lucide-vue-next';

import AgentDashboard from './AgentDashboard.vue';
import AgentsTable from './AgentsTable.vue';
import ApiAnalysis from './ApiAnalysis.vue';
import LogAnalysis from './LogAnalysis.vue';
import PageHeader from './PageHeader.vue';

defineEmits(['notify']);

const tabs = [
  { value: 'agents', label: 'My Agents' },
  { value: 'log', label: 'Log-Based Analysis' },
  { value: 'api', label: 'API-Based Analysis' }
];
const activeTab = ref('agents');
</script>
