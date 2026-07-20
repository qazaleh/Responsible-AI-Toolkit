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

    <div>
      <label class="text-sm font-medium text-[#174143]">Attacks</label>
      <div class="mt-2 grid gap-2 sm:grid-cols-2">
        <label
          v-for="attackName in mvpState.robustnessAttackOptions"
          :key="attackName"
          class="flex items-center gap-2 rounded-lg border border-[#e6dece] bg-[#fffdf8] px-3 py-2 text-sm text-[#174143]"
        >
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-[#e6dece] text-[#305669] focus:ring-[#305669]/30"
            :checked="mvpState.selectedRobustnessAttacks.includes(attackName)"
            @change="onRobustnessAttackToggle(attackName, $event.target.checked)"
          />
          {{ attackName }}
        </label>
      </div>
    </div>

    <p class="text-xs text-[#305669]/70">
      Select at least one attack. If the security service returns a filtered list, only supported attacks remain available.
    </p>
  </div>
</template>

<script setup>
import { classifierOptions, mvpState, onRobustnessAttackToggle, onUploadedMetaChange } from '../../lib/mvpWorkflow';
import Field from './Field.vue';
import SimpleSelect from './SimpleSelect.vue';

function handleClassifierChange(value) {
  mvpState.uploadedTargetClassifier = value;
  onUploadedMetaChange();
}
</script>
