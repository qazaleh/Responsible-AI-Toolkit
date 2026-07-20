<template>
  <div class="space-y-4">
    <div class="grid gap-4 sm:grid-cols-2">
      <Field label="Dataset">
        <SimpleSelect
          :model-value="mvpState.selectedFairnessDatasetKey"
          :options="fairnessDatasetOptions.map(option => option.key)"
          @update:model-value="handleDatasetChange"
        >
        </SimpleSelect>
      </Field>
      <Field label="Bias Type">
        <SimpleSelect
          :model-value="mvpState.fairnessBiasType"
          :options="['PRETRAIN', 'POSTTRAIN']"
          @update:model-value="handleBiasTypeChange"
        />
      </Field>
      <Field label="Method Type">
        <SimpleSelect v-model="mvpState.fairnessMethodType" :options="fairnessMethodOptions.map(option => option.value)" />
      </Field>
      <Field label="Label">
        <TextInput v-model="mvpState.fairnessLabel" />
      </Field>
      <Field label="Favorable Outcome">
        <TextInput v-model="mvpState.fairnessFavorableOutcome" />
      </Field>
    </div>

    <Field label="Protected Attributes (comma separated)">
      <TextInput v-model="mvpState.fairnessProtectedAttributesInput" placeholder="Example: gender" />
    </Field>

    <Field v-if="mvpState.fairnessBiasType === 'POSTTRAIN'" label="Prediction Label">
      <TextInput v-model="mvpState.fairnessPredLabel" placeholder="Example: labels_pred" />
    </Field>

    <details class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-3">
      <summary class="cursor-pointer text-sm font-medium text-[#305669]">Advanced fairness options</summary>
      <div class="mt-3 space-y-4">
        <Field label="Task Type">
          <SimpleSelect v-model="mvpState.fairnessTaskType" :options="['CLASSIFICATION']" />
        </Field>
        <Field label="Privileged Groups (group1;group2 format)">
          <TextInput
            v-model="mvpState.fairnessPrivilegedGroupsInput"
            placeholder="Example: M;Cash loans (comma separated for multiple attributes)"
          />
        </Field>
      </div>
    </details>

    <p class="text-xs text-[#305669]/70">Dataset presets fill these fields automatically. You can still adjust them before evaluation.</p>
  </div>
</template>

<script setup>
import {
  fairnessDatasetOptions,
  fairnessMethodOptions,
  mvpState,
  onFairnessBiasTypeChange,
  onFairnessDatasetChange
} from '../../lib/mvpWorkflow';
import Field from './Field.vue';
import SimpleSelect from './SimpleSelect.vue';
import TextInput from './TextInput.vue';

function handleDatasetChange(value) {
  mvpState.selectedFairnessDatasetKey = value;
  onFairnessDatasetChange();
}

function handleBiasTypeChange(value) {
  mvpState.fairnessBiasType = value;
  onFairnessBiasTypeChange();
}
</script>
