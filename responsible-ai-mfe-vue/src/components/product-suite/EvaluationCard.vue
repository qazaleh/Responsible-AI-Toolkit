<template>
  <CardShell :title="title" content-class="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
    <template #title-icon>
      <component :is="icon" class="h-5 w-5 text-[#305669]" />
    </template>

    <div class="grid gap-4 sm:grid-cols-2">
      <slot name="fields" />
      <button type="button" class="ps-btn-primary w-fit sm:col-span-2" @click="$emit('action')">
        {{ action }}
      </button>
    </div>

    <div class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4">
      <div class="mb-3 text-sm font-semibold text-[#0f2b2c]">Output</div>
      <div class="grid gap-2 sm:grid-cols-2">
        <div v-for="output in outputs" :key="output" class="rounded-lg bg-[#fffdf8] px-3 py-2 text-sm text-[#174143] shadow-xs">
          {{ output }}
        </div>
      </div>
      <button type="button" class="ps-btn-outline mt-4">
        <Download class="h-4 w-4" />
        Download PDF
      </button>
    </div>
  </CardShell>
</template>

<script setup>
import { Download } from 'lucide-vue-next';

import CardShell from './CardShell.vue';

defineProps({
  title: { type: String, required: true },
  icon: { type: [Object, Function], required: true },
  outputs: { type: Array, required: true },
  action: { type: String, required: true }
});
defineEmits(['action']);
</script>
