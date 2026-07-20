<template>
  <div class="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
    <CardShell title="LLM Evaluation" description="Evaluate multiple LLMs using uploaded benchmark prompts." content-class="space-y-5">
      <Field label="Domain">
        <SimpleSelect v-model="domain" :options="domains" />
      </Field>

      <UploadBox label="Prompt Upload" support="JSON or CSV benchmark prompt file" />

      <div class="space-y-3">
        <div class="flex items-center justify-between">
          <label class="text-sm font-medium text-[#174143]">Models</label>
          <button type="button" class="ps-btn-outline" @click="addModel">
            <Plus class="h-4 w-4" />
            Add Model
          </button>
        </div>

        <div class="space-y-3">
          <div v-for="(model, index) in models" :key="model.id" class="grid gap-3 rounded-lg border border-[#e6dece] bg-[#faf7f0] p-3 md:grid-cols-2">
            <TextInput v-model="model.provider" placeholder="Provider" />
            <TextInput v-model="model.modelName" placeholder="Model Name" />
            <TextInput v-model="model.version" placeholder="Version" />
            <TextInput v-model="model.apiUrl" placeholder="API URL" />
            <TextInput type="password" placeholder="API Key / Token" class="md:col-span-2" />
            <button
              type="button"
              class="ps-btn-outline-danger w-fit"
              :disabled="models.length === 1"
              @click="removeModel(model.id)"
            >
              <Trash2 class="h-4 w-4" />
              Remove Model {{ index + 1 }}
            </button>
          </div>
        </div>
      </div>

      <button type="button" class="ps-btn-primary" @click="start">
        Start Evaluation
        <ArrowRight class="h-4 w-4" />
      </button>
    </CardShell>

    <div class="space-y-4">
      <ProgressPanel :running="running" :complete="complete" />
      <ReportActions v-if="complete" />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { ArrowRight, Plus, Trash2 } from 'lucide-vue-next';

import CardShell from './CardShell.vue';
import Field from './Field.vue';
import ProgressPanel from './ProgressPanel.vue';
import ReportActions from './ReportActions.vue';
import SimpleSelect from './SimpleSelect.vue';
import TextInput from './TextInput.vue';
import UploadBox from './UploadBox.vue';

const emit = defineEmits(['notify']);

const domains = ['Finance', 'Banking', 'Insurance', 'Healthcare', 'HR', 'Legal', 'Custom'];

const domain = ref('Finance');
const models = reactive([
  { id: 1, provider: 'OpenAI', modelName: 'GPT-4o', version: '2026-01', apiUrl: 'https://api.example.com/v1', token: '' }
]);
const running = ref(false);
const complete = ref(false);

function addModel() {
  models.push({ id: Date.now(), provider: '', modelName: '', version: '', apiUrl: '', token: '' });
}

function removeModel(id) {
  const index = models.findIndex(model => model.id === id);
  if (index !== -1) {
    models.splice(index, 1);
  }
}

function start() {
  running.value = true;
  complete.value = false;

  window.setTimeout(() => {
    running.value = false;
    complete.value = true;
    emit('notify', 'LLM evaluation completed.');
  }, 900);
}
</script>
