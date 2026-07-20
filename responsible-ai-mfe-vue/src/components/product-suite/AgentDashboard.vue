<template>
  <div class="grid gap-4 md:grid-cols-4">
    <CardShell v-for="stat in stats" :key="stat.label" content-class="flex items-center justify-between pt-1" root-class="py-4">
      <div>
        <p class="text-sm text-[#305669]/70">{{ stat.label }}</p>
        <p class="mt-1 text-xl font-semibold text-[#0f2b2c]">{{ stat.value }}</p>
      </div>
      <component :is="stat.icon" class="h-5 w-5 text-[#305669]" />
    </CardShell>
  </div>
</template>

<script setup>
import { Activity, BarChart3, Bot, FileText } from 'lucide-vue-next';

import CardShell from './CardShell.vue';

const stats = [
  { label: 'Total Agents', value: '14', icon: Bot },
  { label: 'Total Evaluations', value: '82', icon: BarChart3 },
  { label: 'Generated Reports', value: '31', icon: FileText },
  { label: 'Recent Activity', value: '9 today', icon: Activity }
];
</script>
