<template>
  <div class="flex min-h-28 flex-col items-center justify-center rounded-lg border border-dashed border-[#e6dece] bg-[#faf7f0] px-4 py-5 text-center">
    <Upload class="h-6 w-6 text-[#305669]/70" />
    <div class="mt-2 text-sm font-medium text-[#174143]">{{ label }}</div>
    <div class="mt-1 text-xs text-[#305669]/70">{{ support }}</div>
  </div>
</template>

<script setup>
import { Upload } from 'lucide-vue-next';

defineProps({
  label: { type: String, required: true },
  support: { type: String, required: true }
});
</script>
