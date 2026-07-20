<template>
  <CardShell title="My Agents" description="Managed AI agents and their latest evaluation activity." content-class="overflow-x-auto">
    <table class="w-full min-w-[820px] text-left text-sm">
      <thead class="border-b border-[#e6dece] text-xs uppercase text-[#305669]/70">
        <tr>
          <th v-for="header in headers" :key="header" class="py-3 font-semibold">{{ header }}</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-[#e6dece]">
        <tr v-for="agent in agents" :key="agent[0]">
          <td v-for="cell in agent" :key="cell" class="py-3 text-[#174143]">{{ cell }}</td>
          <td class="flex gap-2 py-3">
            <button type="button" class="ps-btn-sm">View</button>
            <button type="button" class="ps-btn-sm" @click="$emit('notify', 'Agent report generated.')">Generate Report</button>
            <button type="button" class="ps-btn-sm-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </CardShell>
</template>

<script setup>
import CardShell from './CardShell.vue';

defineEmits(['notify']);

const headers = ['Agent Name', 'Description', 'Analysis Type', 'Last Activity', 'Status', 'Reports', 'Actions'];

const agents = [
  ['Claims Review Agent', 'Insurance document triage', 'API-Based', '12 min ago', 'Active', '8'],
  ['HR Policy Assistant', 'Employee policy support', 'Log-Based', 'Yesterday', 'Review', '3'],
  ['Banking Service Agent', 'Customer workflow assistant', 'API-Based', '3 days ago', 'Active', '12']
];
</script>
