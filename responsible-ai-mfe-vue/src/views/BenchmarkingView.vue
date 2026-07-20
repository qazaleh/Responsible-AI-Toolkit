<template>
  <section class="rai-card p-6">
    <header>
      <h2 class="text-lg font-semibold text-[#0f2b2c]">LLM Safety Leaderboard</h2>
      <p class="mt-1 text-sm text-[#305669]/70">
        Benchmark comparison of model robustness against guardrail tests
      </p>
    </header>

    <div class="mt-6 overflow-x-auto">
      <table class="w-full border-collapse text-left text-xs">
        <thead>
          <tr class="border-b border-[#e6dece] text-[#305669]/70">
            <th class="py-3 font-semibold">Model</th>
            <th class="py-3 font-semibold">Toxicity Resistance</th>
            <th class="py-3 font-semibold">PII Leakage Shield</th>
            <th class="py-3 font-semibold">Adversarial Robustness</th>
            <th class="py-3 font-semibold">Overall Safety Score</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[#e6dece] text-[#305669]">
          <tr v-for="row in leaderboard" :key="row.model" class="hover:bg-[#faf7f0]">
            <td class="py-4 font-semibold text-[#0f2b2c]">{{ row.model }}</td>
            <td class="py-4">{{ row.toxicity }}</td>
            <td class="py-4">{{ row.pii }}</td>
            <td class="py-4">{{ row.adv }}</td>
            <td class="py-4 font-semibold text-emerald-400">{{ row.overall }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const leaderboard = ref([
  { model: 'Gemini 1.5 Pro', toxicity: '98.5%', pii: '97.8%', adv: '94.5%', overall: '96.9%' },
  { model: 'GPT-4o', toxicity: '97.2%', pii: '96.5%', adv: '93.2%', overall: '95.6%' },
  { model: 'Llama-3-70B', toxicity: '95.4%', pii: '93.1%', adv: '89.8%', overall: '92.7%' }
]);

function formatScore(value) {
  if (typeof value !== 'number') {
    return 'N/A';
  }

  const normalized = value <= 1 ? value * 100 : value;
  return `${normalized.toFixed(1)}%`;
}

onMounted(async () => {
  try {
    const response = await fetch('/api/v1/trustllm/scores/getScores?category=fairness');
    if (!response.ok) {
      return;
    }

    const data = await response.json();
    if (!Array.isArray(data) || !data.length) {
      return;
    }

    const mapped = data
      .map(item => {
        const modelName = Object.keys(item || {})[0];
        if (!modelName) {
          return null;
        }

        const metrics = item[modelName] || {};
        return {
          model: modelName,
          toxicity: formatScore(metrics.toxicity ?? metrics.toxicity_score ?? metrics.Toxicity),
          pii: formatScore(metrics.privacy ?? metrics.pii ?? metrics.privacy_score ?? metrics.Privacy),
          adv: formatScore(
            metrics.robustness ?? metrics.adversarial_robustness ?? metrics.attack_score ?? metrics.Adversarial
          ),
          overall: formatScore(metrics.overall ?? metrics.score ?? metrics.fairness ?? metrics.Fairness)
        };
      })
      .filter(Boolean);

    if (mapped.length) {
      leaderboard.value = mapped;
    }
  } catch (error) {
    console.warn('Failed to fetch leaderboard data', error);
  }
});
</script>
