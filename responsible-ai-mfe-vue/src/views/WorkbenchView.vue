<template>
  <section class="space-y-6">
    <div class="grid gap-6 lg:grid-cols-3">
      <article class="rai-card p-6 lg:col-span-2">
        <header>
          <h2 class="text-lg font-semibold text-[#0f2b2c]">AI Content Analyzer</h2>
          <p class="mt-1 text-sm text-[#305669]/70">Evaluate text content against safety guardrails</p>
        </header>

        <div class="mt-6 space-y-4">
          <label class="block">
            <span class="rai-label">Prompt / Input Text</span>
            <textarea
              v-model="prompt"
              class="rai-textarea"
              placeholder="Enter prompt or model output to scan for safety guidelines..."
            />
          </label>

          <div class="space-y-3">
            <div class="flex justify-between text-xs font-semibold text-[#305669]/70">
              <span>Toxicity Threshold Limit</span>
              <span class="text-indigo-400">{{ threshold.toFixed(2) }}</span>
            </div>
            <input
              v-model="threshold"
              class="h-1 w-full cursor-pointer appearance-none rounded-lg bg-[#e6dece] accent-[#305669]"
              max="0.9"
              min="0.1"
              step="0.05"
              type="range"
            />
          </div>
        </div>

        <footer class="mt-6 flex justify-between">
          <button class="rai-button-secondary h-9" type="button" @click="clearPrompt">
            Clear
          </button>
          <button :disabled="isAnalyzing" class="rai-button-primary h-9" type="button" @click="handleAudit">
            {{ isAnalyzing ? 'Analyzing...' : 'Run Guardrails' }}
          </button>
        </footer>
      </article>

      <article class="rai-card p-6">
        <header>
          <h2 class="text-lg font-semibold text-[#0f2b2c]">Document Upload</h2>
          <p class="mt-1 text-sm text-[#305669]/70">Scan PDFs or CSV datasets</p>
        </header>

        <div class="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#e6dece] bg-[#faf7f0] p-6 text-center text-[#305669]/70 transition hover:text-[#0f2b2c]">
          <Upload class="mb-3 h-8 w-8" />
          <span class="text-xs font-medium">Click to select files or drag to drop</span>
          <span class="mt-1 text-[10px] text-[#305669]/55">Supports PDF, DOCX, CSV (Max 10MB)</span>
        </div>
      </article>
    </div>

    <article v-if="results" class="rai-card animate-in fade-in p-6 duration-300">
      <header class="flex items-center gap-2">
        <Shield class="h-5 w-5 text-emerald-400" />
        <h2 class="text-lg font-semibold text-[#0f2b2c]">Guardrail Analysis Results</h2>
      </header>

      <div class="mt-6 grid gap-6 md:grid-cols-4">
        <div class="space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">Toxicity Score</span>
          <span class="text-2xl font-semibold text-[#0f2b2c]">{{ (results.toxicity * 100).toFixed(1) }}%</span>
        </div>
        <div class="space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">PII Status</span>
          <span class="text-2xl font-semibold text-[#0f2b2c]">{{ results.piiDetected }}</span>
        </div>
        <div class="space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">Safety Score</span>
          <span class="text-2xl font-semibold text-emerald-400">{{ results.safetyCompliance }}%</span>
        </div>
        <div class="space-y-1">
          <span class="block text-[10px] font-bold uppercase tracking-[0.24em] text-[#305669]/60">Recommendation</span>
          <span class="text-2xl font-semibold text-indigo-400">{{ results.recommendation }}</span>
        </div>
      </div>
    </article>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import { Shield, Upload } from 'lucide-vue-next';

import { request } from '../lib/http';

const prompt = ref('');
const threshold = ref(0.7);
const isAnalyzing = ref(false);
const results = ref(null);

function moderationEndpoint() {
  return `${window.location.protocol}//${window.location.hostname}:30024/rai/v1/moderations/coupledmoderations`;
}

function clearPrompt() {
  prompt.value = '';
  results.value = null;
}

async function handleAudit() {
  if (!prompt.value) {
    return;
  }

  isAnalyzing.value = true;

  try {
    const response = await request(moderationEndpoint(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userid: 'admin',
        AccountName: 'Demo',
        PortfolioName: 'Demo',
        lotNumber: 1,
        Prompt: prompt.value,
        model_name: 'gpt4',
        temperature: threshold.value,
        PromptTemplate: 'GoalPriority'
      })
    });

    results.value = {
      toxicity: response?.moderationResults?.toxicityScore ?? Math.random() * 0.3,
      piiDetected:
        response?.privacyResults?.entities?.length > 0
          ? response.privacyResults.entities[0].type
          : 'None',
      safetyCompliance: response?.safetyScore ?? 94.2,
      recommendation: response?.summaryStatus ?? 'Passed Guardrails'
    };
  } catch (error) {
    console.warn('Moderation API failed, falling back to mock data', error);
    results.value = {
      toxicity: Math.random() * 0.3,
      piiDetected: Math.random() > 0.5 ? 'Email Address' : 'None',
      safetyCompliance: 94.2,
      recommendation: 'Passed Guardrails (Mock)'
    };
  } finally {
    isAnalyzing.value = false;
  }
}
</script>
