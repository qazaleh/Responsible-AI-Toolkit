<template>
  <div
    v-if="message"
    class="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg border border-emerald-200 bg-[#fffdf8] px-4 py-3 text-sm font-medium text-emerald-700 shadow-lg"
  >
    <CheckCircle2 class="h-4 w-4" />
    {{ message }}
  </div>
</template>

<script setup>
import { CheckCircle2 } from 'lucide-vue-next';

defineProps({
  message: { type: String, default: '' }
});
</script>
