<template>
  <AnalysisCard
    title="Log-Based Analysis"
    description="Upload historical agent execution logs for evaluation."
    :outputs="['Analysis Summary', 'Detected Sessions', 'Risk Summary', 'Recommendations']"
    action="Start Analysis"
    @action="$emit('notify', 'Log-based analysis completed.')"
  >
    <template #fields>
      <Field label="Select Agent">
        <TextInput placeholder="Claims Review Agent" />
      </Field>
      <Field label="Upload CSV Log File">
        <UploadBox label="CSV Log File" support="Historical execution logs" />
      </Field>
      <Field label="Optional Description">
        <TextInput placeholder="Q2 production review" />
      </Field>
    </template>
  </AnalysisCard>
</template>

<script setup>
import AnalysisCard from './AnalysisCard.vue';
import Field from './Field.vue';
import TextInput from './TextInput.vue';
import UploadBox from './UploadBox.vue';

defineEmits(['notify']);
</script>
