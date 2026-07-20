<template>
  <div
    v-if="mvpState.evaluationInProgress || mvpState.reportDownloadInProgress || mvpState.evaluationError || mvpState.evaluationSuccess || mvpState.reportStatus || mvpState.tenetRunStatuses.length > 0"
    class="space-y-2 rounded-lg border border-[#e6dece] bg-[#faf7f0] p-4 text-sm"
  >
    <p v-if="mvpState.evaluationInProgress" class="flex items-center gap-2 text-[#305669]">
      <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#305669] border-t-transparent" />
      {{ mvpState.currentStepMessage || 'Evaluation in progress...' }}
    </p>
    <p v-if="mvpState.reportDownloadInProgress" class="flex items-center gap-2 text-[#305669]">
      <span class="h-3.5 w-3.5 animate-spin rounded-full border-2 border-[#305669] border-t-transparent" />
      Downloading {{ (mvpState.selectedDownloadTenet || 'report').toLowerCase() }} report...
    </p>
    <p v-if="mvpState.evaluationSuccess" class="text-emerald-700">{{ mvpState.evaluationSuccess }}</p>
    <p v-if="mvpState.reportStatus" class="text-[#174143]">{{ mvpState.reportStatus }}</p>
    <p v-if="mvpState.evaluationError" class="text-rose-700">{{ mvpState.evaluationError }}</p>

    <p
      v-for="runStatus in mvpState.tenetRunStatuses"
      :key="runStatus.name"
      :class="{
        'text-emerald-700': runStatus.state === 'success',
        'text-rose-700': runStatus.state === 'error',
        'text-[#305669]': runStatus.state === 'running'
      }"
    >
      <strong>{{ runStatus.name }}:</strong> {{ runStatus.message }}
      <span v-if="runStatus.batchId"> (Batch {{ runStatus.batchId }})</span>
    </p>
  </div>
</template>

<script setup>
import { mvpState } from '../../lib/mvpWorkflow';
</script>
