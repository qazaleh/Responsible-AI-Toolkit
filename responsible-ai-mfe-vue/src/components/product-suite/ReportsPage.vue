<template>
  <div class="space-y-5">
    <PageHeader label="Reports" title="Shared Reports" description="Reports generated across TrustAI-X and TrustAI-UX." :icon="FileText" />

    <CardShell title="Report Library" description="Filter by product, module, status, or date range." content-class="space-y-4">
      <div class="grid gap-3 md:grid-cols-4">
        <SimpleSelect v-model="productFilter" :options="['All Products', 'TrustAI-X', 'TrustAI-UX']" />
        <TextInput placeholder="Module" />
        <SimpleSelect v-model="statusFilter" :options="['All Statuses', 'Ready', 'Processing', 'Failed']" />
        <TextInput placeholder="Date Range" />
      </div>

      <div class="overflow-x-auto">
        <table class="w-full min-w-[820px] text-left text-sm">
          <thead class="border-b border-[#e6dece] text-xs uppercase text-[#305669]/70">
            <tr>
              <th v-for="header in headers" :key="header" class="py-3 font-semibold">{{ header }}</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[#e6dece]">
            <tr v-for="report in reports" :key="report[0]">
              <td v-for="cell in report" :key="cell" class="py-3 text-[#174143]">{{ cell }}</td>
              <td class="py-3">
                <button type="button" class="ps-btn-sm">
                  <Download class="h-4 w-4" />
                  Download
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardShell>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Download, FileText } from 'lucide-vue-next';

import CardShell from './CardShell.vue';
import PageHeader from './PageHeader.vue';
import SimpleSelect from './SimpleSelect.vue';
import TextInput from './TextInput.vue';

const productFilter = ref('All Products');
const statusFilter = ref('All Statuses');

const headers = ['Report Name', 'Product', 'Module', 'Agent / Model', 'Created Date', 'Status', 'Download'];

const reports = [
  ['LLM Finance Benchmark', 'TrustAI-X', 'LLM Evaluation', 'GPT-4o', '2026-07-09', 'Ready'],
  ['Claims Agent Safety', 'TrustAI-UX', 'API-Based Analysis', 'Claims Review Agent', '2026-07-08', 'Ready'],
  ['Credit Model Fairness', 'TrustAI-X', 'Fairness', 'Credit Risk Model', '2026-07-07', 'Processing']
];
</script>
