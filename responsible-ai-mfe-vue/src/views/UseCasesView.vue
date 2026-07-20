<template>
  <section class="space-y-6">
    <div class="grid gap-6 md:grid-cols-3">
      <article class="rai-card p-6">
        <header>
          <h2 class="text-lg font-semibold text-[#0f2b2c]">Register Use Case</h2>
          <p class="mt-1 text-sm text-[#305669]/70">Establish a new safety compliance scope</p>
        </header>

        <div class="mt-6 space-y-4">
          <label class="block">
            <span class="rai-label">Project / Use Case Name</span>
            <input
              v-model="name"
              class="rai-input"
              placeholder="Financial Analyst Agent"
              type="text"
            />
          </label>

          <label class="block">
            <span class="rai-label">Base Language Model</span>
            <select v-model="model" class="rai-select">
              <option value="GPT-4o">GPT-4o</option>
              <option value="Llama-3-70B">Llama-3-70B</option>
              <option value="Gemini-1.5-Pro">Gemini 1.5 Pro</option>
            </select>
          </label>
        </div>

        <footer class="mt-6">
          <button class="rai-button-primary w-full" type="button" @click="handleCreate">
            <Plus class="h-4 w-4" />
            Create Use Case
          </button>
        </footer>
      </article>

      <div class="space-y-4 md:col-span-2">
        <article
          v-for="useCase in useCases"
          :key="useCase.id"
          class="rai-card cursor-pointer p-6 transition hover:bg-[#faf7f0]"
          @click="selectUseCase(useCase)"
        >
          <div class="flex items-center justify-between gap-4">
            <div class="space-y-1">
              <h3 class="text-base font-semibold text-[#0f2b2c]">{{ useCase.name }}</h3>
              <p class="text-xs text-[#305669]/70">
                Target Model:
                <span class="font-medium text-indigo-400">{{ useCase.model }}</span>
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span class="h-2 w-2 rounded-full bg-emerald-500" />
              <span class="text-xs font-medium text-emerald-600">{{ useCase.status }}</span>
            </div>
          </div>
        </article>

        <article v-if="selectedUseCase" class="rai-card p-6">
          <header class="flex items-center justify-between">
            <div>
              <p class="rai-kicker">Canvas Preview</p>
              <h3 class="mt-2 text-xl font-semibold text-[#0f2b2c]">{{ selectedUseCase.name }}</h3>
            </div>
            <ClipboardList class="h-5 w-5 text-indigo-400" />
          </header>

          <div v-if="previewLoading" class="mt-5 space-y-3">
            <div v-for="item in 2" :key="item" class="h-32 animate-pulse rounded-xl border border-[#e6dece] bg-[#faf7f0]" />
          </div>

          <div v-else class="mt-5 grid gap-4">
            <article class="rai-card-soft p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">AI Canvas</p>
              <pre class="mt-3 overflow-x-auto text-xs leading-6 text-[#174143]">{{ aiCanvasDisplay }}</pre>
            </article>
            <article class="rai-card-soft p-4">
              <p class="text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">RAI Canvas</p>
              <pre class="mt-3 overflow-x-auto text-xs leading-6 text-[#174143]">{{ raiCanvasDisplay }}</pre>
            </article>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue';
import { ClipboardList, Plus } from 'lucide-vue-next';

import { authState } from '../lib/auth';
import { getCatalogValue, loadCatalog } from '../lib/catalog';
import { request } from '../lib/http';
import { encodeUserSegment, joinUrl } from '../lib/urls';

const useCases = ref([]);
const selectedUseCase = ref(null);
const name = ref('');
const model = ref('GPT-4o');
const previewLoading = ref(false);
const aiCanvas = ref(null);
const raiCanvas = ref(null);

const aiCanvasDisplay = computed(() =>
  aiCanvas.value ? JSON.stringify(aiCanvas.value, null, 2) : 'No AI canvas response found.'
);
const raiCanvasDisplay = computed(() =>
  raiCanvas.value ? JSON.stringify(raiCanvas.value, null, 2) : 'No RAI canvas response found.'
);

function getUserId() {
  return authState.account?.login || 'admin';
}

function questionnaireEndpoint(pathKey) {
  return joinUrl(getCatalogValue('Questionnaire'), getCatalogValue(pathKey));
}

async function loadUseCases() {
  try {
    await loadCatalog();
    const response = await request(
      `${questionnaireEndpoint('Questionnaire_getUsecaseDetail')}${encodeUserSegment(getUserId())}`
    );
    const firstRow = Array.isArray(response) ? response[0] : null;
    const names = Array.isArray(firstRow?.useCaseName) ? firstRow.useCaseName : [];

    useCases.value = names.length
      ? names.map((item, index) => ({
          id: index + 1,
          name: item,
          model: index % 2 ? 'Llama-3-70B' : 'GPT-4o',
          status: index % 2 ? 'Auditing' : 'Active Compliance'
        }))
      : [
          { id: 1, name: 'Customer Relations Chatbot', model: 'GPT-4o', status: 'Active Compliance' },
          { id: 2, name: 'Healthcare PII Scrubber', model: 'Llama-3-70B', status: 'Auditing' }
        ];
  } catch (error) {
    console.warn('Failed to fetch use cases', error);
    useCases.value = [
      { id: 1, name: 'Customer Relations Chatbot', model: 'GPT-4o', status: 'Active Compliance' },
      { id: 2, name: 'Healthcare PII Scrubber', model: 'Llama-3-70B', status: 'Auditing' }
    ];
  }
}

async function handleCreate() {
  if (!name.value) {
    return;
  }

  try {
    await loadCatalog();
    await request(questionnaireEndpoint('Questionnaire_createUsecase'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        UserId: getUserId(),
        UseCaseName: name.value
      })
    });
  } catch (error) {
    console.warn('Failed to create use case', error);
  } finally {
    useCases.value = [
      ...useCases.value,
      {
        id: useCases.value.length + 1,
        name: name.value,
        model: model.value,
        status: 'Configured'
      }
    ];
    name.value = '';
  }
}

async function selectUseCase(useCase) {
  selectedUseCase.value = useCase;
  previewLoading.value = true;
  aiCanvas.value = null;
  raiCanvas.value = null;

  try {
    await loadCatalog();
    const userId = getUserId();
    const aiCanvasUrl = questionnaireEndpoint('AI_Canvas_Response');
    const raiCanvasUrl = questionnaireEndpoint('Canvas_Response');

    if (aiCanvasUrl) {
      aiCanvas.value = await request(
        `${aiCanvasUrl}${encodeUserSegment(userId)}/${encodeURIComponent(useCase.name)}`
      );
    }

    if (raiCanvasUrl) {
      raiCanvas.value = await request(
        `${raiCanvasUrl}${encodeUserSegment(userId)}/${encodeURIComponent(useCase.name)}`
      );
    }
  } catch (error) {
    console.warn('Failed to fetch canvas preview', error);
  } finally {
    previewLoading.value = false;
  }
}

onMounted(() => {
  loadUseCases();
});
</script>
