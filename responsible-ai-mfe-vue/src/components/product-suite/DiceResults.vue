<template>
  <CardShell v-if="mvpState.diceResult" title="DiCE Counterfactual Result" content-class="space-y-4">
    <p class="text-sm text-[#305669]">
      Original prediction: <strong class="text-[#0f2b2c]">{{ mvpState.diceResult.predictedClass }}</strong>
      <span class="mx-1.5 text-[#c5ba9b]">•</span>
      Desired prediction: <strong class="text-[#0f2b2c]">{{ mvpState.diceResult.desiredClass }}</strong>
      <span class="mx-1.5 text-[#c5ba9b]">•</span>
      Selected row: <strong class="text-[#0f2b2c]">{{ mvpState.diceResult.inputIndex }}</strong>
    </p>

    <div class="grid gap-4 md:grid-cols-2">
      <section class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-[#305669]/70">Original Instance</h4>
        <ul class="mt-2 space-y-1.5">
          <li
            v-for="feature in getDiceFeatureEntries(mvpState.diceResult.originalInstance)"
            :key="feature.key"
            class="flex items-center justify-between gap-2 text-sm"
          >
            <span class="text-[#305669]">{{ feature.key }}</span>
            <span class="font-medium text-[#0f2b2c]">{{ feature.value }}</span>
          </li>
        </ul>
      </section>

      <section class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
        <h4 class="text-xs font-semibold uppercase tracking-wide text-[#305669]/70">Summary</h4>
        <ul class="mt-2 space-y-1.5 text-sm">
          <li class="flex items-center justify-between gap-2">
            <span class="text-[#305669]">Counterfactuals</span>
            <span class="font-medium text-[#0f2b2c]">{{ mvpState.diceResult.summary.counterfactualCount }}</span>
          </li>
          <li class="flex items-center justify-between gap-2">
            <span class="text-[#305669]">Avg. Changed Features</span>
            <span class="font-medium text-[#0f2b2c]">{{ mvpState.diceResult.summary.averageChangedFeatures }}</span>
          </li>
          <li class="flex items-center justify-between gap-2">
            <span class="text-[#305669]">Avg. L1 Distance</span>
            <span class="font-medium text-[#0f2b2c]">{{ mvpState.diceResult.summary.averageDistanceL1 }}</span>
          </li>
        </ul>
      </section>
    </div>

    <div
      v-for="example in mvpState.diceResult.counterfactuals"
      :key="example.counterfactualIndex"
      class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4"
    >
      <div class="flex items-center justify-between">
        <span class="text-sm font-semibold text-[#0f2b2c]">Counterfactual {{ example.counterfactualIndex }}</span>
        <span class="rounded-full bg-[#faeab1] px-2.5 py-1 text-xs font-medium text-[#0f2b2c]">
          Prediction: {{ example.predictedClass }}
        </span>
      </div>
      <p class="mt-2 text-sm text-[#305669]">{{ example.interpretation }}</p>

      <div class="mt-3 grid gap-4 md:grid-cols-2">
        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide text-[#305669]/70">Counterfactual Values</h4>
          <ul class="mt-2 space-y-1.5">
            <li
              v-for="feature in getDiceFeatureEntries(example.data)"
              :key="feature.key"
              class="flex items-center justify-between gap-2 text-sm"
            >
              <span class="text-[#305669]">{{ feature.key }}</span>
              <span class="font-medium text-[#0f2b2c]">{{ feature.value }}</span>
            </li>
          </ul>
        </section>

        <section>
          <h4 class="text-xs font-semibold uppercase tracking-wide text-[#305669]/70">Changed Features</h4>
          <ul v-if="example.changedFeatures.length > 0" class="mt-2 space-y-1.5">
            <li v-for="change in example.changedFeatures" :key="change.featureName" class="text-sm">
              <span class="text-[#305669]">{{ change.featureName }}</span>
              <span class="ml-2 font-medium text-[#0f2b2c]">{{ change.originalValue }} → {{ change.counterfactualValue }}</span>
            </li>
          </ul>
          <p v-else class="mt-2 text-sm text-[#305669]/70">No feature changes were returned.</p>
        </section>
      </div>
    </div>
  </CardShell>
</template>

<script setup>
import { getDiceFeatureEntries, mvpState } from '../../lib/mvpWorkflow';
import CardShell from './CardShell.vue';
</script>
