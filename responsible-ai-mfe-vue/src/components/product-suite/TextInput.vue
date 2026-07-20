<template>
  <input
    :type="type"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    class="h-10 w-full min-w-0 rounded-lg border border-[#e6dece] bg-[#fffdf8] px-3 text-sm text-[#0f2b2c] outline-none transition-colors placeholder:text-[#305669]/50 focus-visible:border-[#305669] focus-visible:ring-2 focus-visible:ring-[#305669]/20 disabled:cursor-not-allowed disabled:opacity-50"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  disabled: { type: Boolean, default: false }
});
defineEmits(['update:modelValue']);
</script>
