<template>
  <CardShell title="Evaluation Results" description="Generate and download an executive-ready PDF report." content-class="flex flex-wrap gap-3">
    <button type="button" class="ps-btn-primary">
      <FileText class="h-4 w-4" />
      Generate PDF Report
    </button>
    <button type="button" class="ps-btn-outline">
      <Download class="h-4 w-4" />
      Download Report
    </button>
  </CardShell>
</template>

<script setup>
import { Download, FileText } from 'lucide-vue-next';

import CardShell from './CardShell.vue';
</script>
