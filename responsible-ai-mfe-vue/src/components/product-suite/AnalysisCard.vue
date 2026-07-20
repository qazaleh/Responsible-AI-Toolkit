<template>
  <CardShell :title="title" :description="description" content-class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
    <div class="space-y-4">
      <slot name="fields" />
      <button type="button" class="ps-btn-primary" @click="$emit('action')">{{ action }}</button>
    </div>

    <div class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
      <div class="mb-3 text-sm font-semibold text-[#0f2b2c]">Output</div>
      <div class="grid gap-2 sm:grid-cols-2">
        <div v-for="output in outputs" :key="output" class="rounded-lg bg-[#fffdf8] px-3 py-2 text-sm text-[#174143] shadow-xs">
          {{ output }}
        </div>
      </div>
      <div class="mt-4 flex flex-wrap gap-2">
        <button type="button" class="ps-btn-outline">
          <FileText class="h-4 w-4" />
          Generate PDF Report
        </button>
        <button type="button" class="ps-btn-outline">
          <Download class="h-4 w-4" />
          Download Report
        </button>
      </div>
    </div>
  </CardShell>
</template>

<script setup>
import { Download, FileText } from 'lucide-vue-next';

import CardShell from './CardShell.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  outputs: { type: Array, required: true },
  action: { type: String, required: true }
});
defineEmits(['action']);
</script>
