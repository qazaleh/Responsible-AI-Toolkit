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

    <div class="grid gap-4 sm:grid-cols-2">
      <Field label="Selected Row Index">
        <TextInput v-model="mvpState.diceInputIndex" type="number" />
      </Field>
      <Field label="Desired Class">
        <TextInput v-model="mvpState.diceDesiredClass" placeholder="opposite, 0, 1, or a class label" />
      </Field>
      <Field label="Counterfactual Count">
        <TextInput v-model="mvpState.diceTotalCounterfactuals" type="number" />
      </Field>
      <Field label="Immutable Features">
        <TextInput v-model="mvpState.diceImmutableFeaturesInput" placeholder="age, gender, race" />
      </Field>
    </div>

    <Field label="Permitted Range">
      <textarea
        v-model="mvpState.dicePermittedRangeInput"
        rows="4"
        class="w-full rounded-lg border border-[#e6dece] bg-[#fffdf8] px-3 py-2 text-sm text-[#0f2b2c] outline-none transition-colors placeholder:text-[#305669]/50 focus-visible:border-[#305669] focus-visible:ring-2 focus-visible:ring-[#305669]/20"
        placeholder='{"income":[20000,100000],"hours_per_week":[20,60]}'
      />
    </Field>

    <p class="text-xs text-[#305669]/70">
      Immutable features are sent as <code>immutable_features</code>. Permitted ranges must be valid JSON and use
      dataset feature names like {{ mvpState.datasetColumns.join(', ') || 'the loaded columns' }}.
    </p>
    <p class="text-xs text-[#305669]/70">DiCE runs in its own isolated service, so SHAP/LIME/global explainability stays untouched.</p>
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
