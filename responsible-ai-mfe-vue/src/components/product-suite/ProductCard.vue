<template>
  <CardShell>
    <template #header>
      <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]">
        <component :is="icon" class="h-6 w-6" />
      </div>
      <h3 class="mt-3 text-xl font-medium leading-snug text-[#0f2b2c]">{{ title }}</h3>
      <p class="text-sm text-[#305669]">{{ description }}</p>
    </template>
    <button type="button" class="ps-btn-primary" @click="$emit('enter')">
      Enter Product
      <ArrowRight class="h-4 w-4" />
    </button>
  </CardShell>
</template>

<script setup>
import { ArrowRight } from 'lucide-vue-next';

import CardShell from './CardShell.vue';

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: [Object, Function], required: true }
});
defineEmits(['enter']);
</script>
