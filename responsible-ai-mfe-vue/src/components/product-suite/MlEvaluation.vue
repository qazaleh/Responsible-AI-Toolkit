<template>
  <MlResultTabs @notify="message => $emit('notify', message)" />
</template>

<script setup>
import MlResultTabs from './MlResultTabs.vue';

defineEmits(['notify']);
</script>
