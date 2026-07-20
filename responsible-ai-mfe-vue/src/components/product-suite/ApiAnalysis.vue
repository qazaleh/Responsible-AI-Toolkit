<template>
  <AnalysisCard
    title="API-Based Analysis"
    description="Evaluate agent executions collected through API integration."
    :outputs="['Execution Summary', 'Evaluation Results', 'Timeline', 'Recommendations']"
    action="Generate Evaluation"
    @action="$emit('notify', 'API-based evaluation generated.')"
  >
    <template #fields>
      <Field label="Select Agent">
        <TextInput placeholder="Banking Service Agent" />
      </Field>
      <Field label="Time Range">
        <SimpleSelect v-model="timeRange" :options="['Last Hour', 'Last 24 Hours', 'Last 7 Days', 'Custom Range']" />
      </Field>
      <Field label="Evaluation Modules">
        <TextInput :model-value="evaluationModules.join(', ')" />
      </Field>
      <Field label="Report Type">
        <SimpleSelect v-model="reportType" :options="['Executive Summary', 'Technical Report', 'Full Report']" />
      </Field>
    </template>
  </AnalysisCard>
</template>

<script setup>
import { ref } from 'vue';

import AnalysisCard from './AnalysisCard.vue';
import Field from './Field.vue';
import SimpleSelect from './SimpleSelect.vue';
import TextInput from './TextInput.vue';

defineEmits(['notify']);

const evaluationModules = ['Behavior Analysis', 'Explainability', 'Safety', 'Policy Compliance', 'Performance', 'Tool Usage'];
const timeRange = ref('Last 24 Hours');
const reportType = ref('Full Report');
</script>
