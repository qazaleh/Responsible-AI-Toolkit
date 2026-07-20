<template>
  <div v-if="!running && !complete" class="rounded-lg border border-[#e6dece] bg-[#faf7f0] p-5 text-sm text-[#305669]/70">
    Evaluation output will appear here after the run starts.
  </div>

  <div v-else class="space-y-4 rounded-lg border border-[#e6dece] bg-[#fffdf8] p-5">
    <div class="flex items-center justify-between">
      <div>
        <div class="text-sm font-semibold text-[#0f2b2c]">{{ complete ? 'Evaluation Results' : 'Evaluation Progress' }}</div>
        <div class="text-xs text-[#305669]/70">{{ complete ? 'Report generation is available.' : 'Running selected modules...' }}</div>
      </div>
      <span
        class="rounded-full px-2.5 py-1 text-xs font-medium"
        :class="complete ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'"
      >
        {{ complete ? 'Complete' : 'In progress' }}
      </span>
    </div>
    <div class="h-2 rounded-full bg-[#faeab1]">
      <div class="h-2 rounded-full bg-[#305669] transition-all" :class="complete ? 'w-full' : 'w-2/3'" />
    </div>
    <div v-if="complete" class="grid gap-3 sm:grid-cols-3">
      <div
        v-for="item in ['Safety score 94%', 'Bias risk Low', 'Report Ready']"
        :key="item"
        class="rounded-lg border border-[#e6dece] bg-[#faf7f0] px-3 py-2 text-sm text-[#174143]"
      >
        {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  running: { type: Boolean, default: false },
  complete: { type: Boolean, default: false }
});
</script>
