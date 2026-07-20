<template>
  <div class="space-y-2">
    <label class="text-sm font-medium text-[#174143]">{{ label }}</label>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  label: { type: String, required: true }
});
</script>
