<template>
  <CardShell
    v-for="(card, cardIndex) in mvpState.explainabilityCards.slice(0, 2)"
    :key="card.methodName + cardIndex"
    :title="`${cardIndex + 1}. ${card.methodName}`"
    :description="card.methodDescription"
    content-class="space-y-4"
  >
    <div v-for="(row, rowIndex) in card.rows" :key="rowIndex" class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-[#0f2b2c]">Sample {{ rowIndex + 1 }}</span>
        <span class="rounded-full bg-[#faeab1] px-2.5 py-1 text-xs font-medium text-[#0f2b2c]">
          Prediction: {{ row.prediction || '-' }}
        </span>
      </div>

      <div class="mt-3 grid gap-4 md:grid-cols-2">
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide text-[#305669]/70">Input Snapshot</h4>
          <ul class="mt-2 space-y-1.5">
            <li
              v-for="feature in row.inputRow.slice(0, 8)"
              :key="feature.featureName"
              class="flex items-center justify-between gap-2 text-sm"
            >
              <span class="text-[#305669]">{{ feature.featureName }}</span>
              <span class="font-medium text-[#0f2b2c]" :title="getFeatureValueTitle(feature.featureValue)">
                {{ formatFeatureValue(feature.featureValue) }}
              </span>
            </li>
          </ul>
        </section>

        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide text-[#305669]/70">Top Importance</h4>
          <div v-if="row.explanation && row.explanation.length" class="mt-2 space-y-2">
            <div v-for="item in getTopExplanations(row.explanation)" :key="item.featureName" class="space-y-1">
              <div class="flex items-center justify-between text-xs text-[#305669]">
                <span>{{ item.featureName }}</span>
                <span>{{ formatImportance(item.importanceScore) }}</span>
              </div>
              <div class="h-1.5 rounded-full bg-[#e6dece]">
                <div
                  class="h-1.5 rounded-full bg-[#305669]"
                  :style="{ width: getBarWidth(item.importanceScore, getMaxAbsoluteImportance(row.explanation)) + '%' }"
                />
              </div>
            </div>
          </div>
          <p v-else class="mt-2 text-sm text-[#305669]/70">No feature importance values were returned.</p>
        </section>
      </div>
    </div>
  </CardShell>
</template>

<script setup>
import {
  formatFeatureValue,
  formatImportance,
  getBarWidth,
  getMaxAbsoluteImportance,
  getTopExplanations,
  mvpState
} from '../../lib/mvpWorkflow';
import CardShell from './CardShell.vue';

function getFeatureValueTitle(value) {
  return value === null || value === undefined ? '' : String(value);
}
</script>
