<template>
  <div class="space-y-4">
    <div class="ps-tab-list">
      <button
        v-for="tab in tabs"
        :key="tab"
        type="button"
        class="ps-tab-trigger"
        :class="{ 'ps-tab-trigger-active': mvpState.uiTab === tab }"
        @click="setUiTab(tab)"
      >
        {{ tab }}
      </button>
    </div>

    <CardShell :title="setupTitles[mvpState.uiTab]" content-class="space-y-4">
      <component :is="setupComponents[mvpState.uiTab]" />
      <button type="button" class="ps-btn-primary w-fit" :disabled="!canEvaluate" @click="runEvaluation">
        {{ mvpState.evaluationInProgress ? 'Running Evaluation...' : actionLabels[mvpState.uiTab] }}
      </button>
    </CardShell>

    <EvaluationStatusPanel />
    <ExplainabilityResults v-if="mvpState.uiTab === 'explainability'" />
    <DiceResults v-if="mvpState.uiTab === 'counterfactuals'" />
    <ReportDownloadPanel />
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

import { canEvaluate, evaluate, initMvpWorkflow, mvpState, setUiTab } from '../../lib/mvpWorkflow';
import CardShell from './CardShell.vue';
import DiceResults from './DiceResults.vue';
import DiceSetup from './DiceSetup.vue';
import EvaluationStatusPanel from './EvaluationStatusPanel.vue';
import ExplainabilityResults from './ExplainabilityResults.vue';
import ExplainabilitySetup from './ExplainabilitySetup.vue';
import FairnessSetup from './FairnessSetup.vue';
import ReportDownloadPanel from './ReportDownloadPanel.vue';
import RobustnessSetup from './RobustnessSetup.vue';

const emit = defineEmits(['notify']);

const tabs = ['explainability', 'fairness', 'robustness', 'counterfactuals'];

const setupComponents = {
  explainability: ExplainabilitySetup,
  fairness: FairnessSetup,
  robustness: RobustnessSetup,
  counterfactuals: DiceSetup
};

const setupTitles = {
  explainability: 'Explainability Setup',
  fairness: 'Fairness Setup',
  robustness: 'Robustness Setup',
  counterfactuals: 'Counterfactual Setup (DiCE)'
};

const actionLabels = {
  explainability: 'Evaluate Explainability',
  fairness: 'Evaluate Fairness',
  robustness: 'Evaluate Robustness',
  counterfactuals: 'Generate Counterfactuals'
};

async function runEvaluation() {
  await evaluate();
  if (mvpState.evaluationSuccess) {
    emit('notify', mvpState.evaluationSuccess);
  } else if (mvpState.evaluationError) {
    emit('notify', mvpState.evaluationError);
  }
}

onMounted(() => {
  initMvpWorkflow();
});
</script>
