<template>
  <div class="space-y-4">
    <p class="text-xs text-[#305669]/70">
      Dataset: <strong class="text-[#174143]">banking_loan_training.csv</strong>
    </p>

    <Field label="Target Classifier">
      <SimpleSelect
        :model-value="mvpState.uploadedTargetClassifier"
        :options="classifierOptions"
        @update:model-value="handleClassifierChange"
      />
    </Field>

    <label class="flex items-center gap-2 text-sm text-[#174143]">
      <input
        v-model="mvpState.showExplainPreview"
        type="checkbox"
        class="h-4 w-4 rounded border-[#e6dece] text-[#305669] focus:ring-[#305669]/30"
      />
      Show in-page explanation preview
    </label>

    <Field v-if="mvpState.showExplainPreview" label="LIME sample limit">
      <TextInput v-model="mvpState.explainSampleLimit" type="number" />
    </Field>

    <p class="text-xs text-[#305669]/70">Default runs report only so this service stays faster and more stable.</p>
  </div>
</template>

<script setup>
import { classifierOptions, mvpState, onUploadedMetaChange } from '../../lib/mvpWorkflow';
import Field from './Field.vue';
import SimpleSelect from './SimpleSelect.vue';
import TextInput from './TextInput.vue';

function handleClassifierChange(value) {
  mvpState.uploadedTargetClassifier = value;
  onUploadedMetaChange();
}
</script>
