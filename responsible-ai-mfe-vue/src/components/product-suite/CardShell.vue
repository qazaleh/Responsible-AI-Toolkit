<template>
  <div class="flex flex-col gap-4 rounded-xl border border-[#e6dece] bg-[#fffdf8] py-4 shadow-sm" :class="rootClass">
    <div v-if="title || description || $slots.header" class="flex flex-col gap-1 px-4">
      <slot name="header">
        <h3 class="flex items-center gap-2 text-base font-medium leading-snug text-[#0f2b2c]">
          <slot name="title-icon" />
          {{ title }}
        </h3>
        <p v-if="description" class="text-sm text-[#305669]">{{ description }}</p>
      </slot>
    </div>
    <div class="px-4" :class="contentClass">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, default: '' },
  description: { type: String, default: '' },
  contentClass: { type: [String, Array, Object], default: '' },
  rootClass: { type: [String, Array, Object], default: '' }
});
</script>
