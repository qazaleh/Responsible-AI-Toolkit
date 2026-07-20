<template>
  <div v-if="canDownloadReport" class="flex flex-wrap items-center gap-3 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-4">
    <span class="text-sm font-semibold text-[#0f2b2c]">Evaluation Reports</span>
    <SimpleSelect
      v-if="availableDownloadTenets.length > 1"
      v-model="mvpState.selectedDownloadTenet"
      :options="availableDownloadTenets"
      class="w-auto"
    />
    <button type="button" class="ps-btn-outline ml-auto" :disabled="!canDownloadReport" @click="downloadReport">
      <Download class="h-4 w-4" />
      {{ mvpState.reportDownloadInProgress ? 'Downloading Report...' : 'Download Report' }}
    </button>
  </div>
</template>

<script setup>
import { Download } from 'lucide-vue-next';

import { availableDownloadTenets, canDownloadReport, downloadReport, mvpState } from '../../lib/mvpWorkflow';
import SimpleSelect from './SimpleSelect.vue';
</script>
