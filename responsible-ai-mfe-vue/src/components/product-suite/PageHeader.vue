<template>
  <div class="flex flex-col gap-4 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-5 shadow-sm md:flex-row md:items-center md:justify-between">
    <div>
      <div class="text-sm font-medium text-[#305669]">{{ label }}</div>
      <h2 class="mt-1 text-2xl font-semibold text-[#0f2b2c]">{{ title }}</h2>
      <p class="mt-2 max-w-3xl text-sm text-[#305669]">{{ description }}</p>
    </div>
    <div class="flex h-12 w-12 items-center justify-center rounded-xl bg-[#faeab1] text-[#305669]">
      <component :is="icon" class="h-6 w-6" />
    </div>
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: [Object, Function], required: true }
});
</script>
