<template>
  <select
    :value="modelValue"
    class="h-10 w-full rounded-lg border border-[#e6dece] bg-[#fffdf8] px-3 text-sm text-[#0f2b2c] outline-none transition-colors focus-visible:border-[#305669] focus-visible:ring-2 focus-visible:ring-[#305669]/20"
    @change="$emit('update:modelValue', $event.target.value)"
  >
    <option v-for="option in options" :key="option" :value="option">{{ option }}</option>
  </select>
</template>

<script setup>
defineProps({
  modelValue: { type: String, default: '' },
  options: { type: Array, required: true }
});
defineEmits(['update:modelValue']);
</script>
