import { computed, reactive } from 'vue';

import { authState } from './auth';
import { getStoredToken, request } from './http';
import { runtimeState } from './runtime';

const FIXED_DATASET_ASSET_PATH = '/assets/dataset/banking_loan_training.csv';
const FIXED_DATASET_FILE_NAME = 'banking_loan_training.csv';
const FIXED_DATASET_NAME = 'banking_loan_training';

const DEFAULT_ROBUSTNESS_ATTACKS = [
  'ProjectedGradientDescentTabular',
  'FastGradientMethod',
  'Deepfool',
  'CarliniL2Method'
];

const FALLBACK_API_CONFIG = {
  workbenchData: 'http://localhost:30020/v1/workbench/data',
  workbenchModel: 'http://localhost:30020/v1/workbench/model',
  workbenchAddData: 'http://localhost:30020/v1/workbench/adddata',
  workbenchAddModel: 'http://localhost:30020/v1/workbench/addmodel',
  batchGeneration: 'http://localhost:30020/v1/workbench/batchgeneration',
  explainMethods: 'http://localhost:8002/rai/v1/explainability/methods/get',
  explainGet: 'http://localhost:8002/rai/v1/explainability/explanation/get',
  explainReport: 'http://localhost:8002/rai/v1/explainability/report/generate',
  diceCounterfactual: 'http://localhost:8004/rai/v1/dice/counterfactual',
  diceReport: 'http://localhost:8004/rai/v1/dice/report',
  fairnessReport: 'http://localhost:8000/api/v1/fairness/wrapper/batchId',
  fairnessDownload: 'http://localhost:8000/api/v1/fairness/wrapper/download',
  securityApplicableAttacks: 'http://localhost:30023/rai/v1/security_workbench/attack',
  securityValidateAttackRun: 'http://localhost:30023/rai/v1/security_workbench/validateattackrun',
  securityReport: 'http://localhost:30023/rai/v1/security_workbench/runallattacks',
  downloadWorkReport: 'http://localhost:30021/v1/report/downloadreport'
};

const REMOTE_CONFIG_HOST_KEYWORDS = ['rai-toolkit-dev.az.ad.idemo-ppc.com'];

export const classifierModelAssets = [
  {
    classifierLabel: 'LogisticRegression',
    normalizedClassifier: 'SklearnClassifier',
    modelFileName: 'sklearn_logistic_regression_f3ca733a.joblib',
    modelAssetPath: '/assets/modelsList/sklearn_logistic_regression_f3ca733a.joblib'
  },
  {
    classifierLabel: 'RandomForestClassifier',
    normalizedClassifier: 'SklearnClassifier',
    modelFileName: 'sklearn_random_forest_befd3c93.joblib',
    modelAssetPath: '/assets/modelsList/sklearn_random_forest_befd3c93.joblib'
  }
];

export const classifierOptions = classifierModelAssets.map(asset => asset.classifierLabel);

export const fairnessDatasetOptions = [
  {
    key: 'fairness-banking-loan',
    label: 'Banking Loan Fairness Dataset',
    datasetName: 'banking_loan_predictions',
    datasetFileName: 'banking_loan_predictions.csv',
    datasetAssetPath: '/assets/dataset/fairnessDatasets/banking_loan_predictions.csv',
    hiddenModelLabel: 'LogisticRegression',
    presets: {
      PRETRAIN: { label: 'approved', favorableOutcome: '1', protectedAttributesInput: 'gender', privilegedGroupsInput: 'M' },
      POSTTRAIN: {
        label: 'approved',
        favorableOutcome: '1',
        protectedAttributesInput: 'gender',
        privilegedGroupsInput: 'M',
        predLabel: 'pred_label'
      }
    }
  },
  {
    key: 'fairness-insurance-claims',
    label: 'Insurance Claims Fairness Dataset',
    datasetName: 'insurance_claims_predictions',
    datasetFileName: 'insurance_claims_predictions.csv',
    datasetAssetPath: '/assets/dataset/fairnessDatasets/insurance_claims_predictions.csv',
    hiddenModelLabel: 'LogisticRegression',
    presets: {
      PRETRAIN: { label: 'suspected_fraud', favorableOutcome: '1', protectedAttributesInput: 'region', privilegedGroupsInput: 'North' },
      POSTTRAIN: {
        label: 'suspected_fraud',
        favorableOutcome: '1',
        protectedAttributesInput: 'region',
        privilegedGroupsInput: 'North',
        predLabel: 'pred_label'
      }
    }
  }
];

export const fairnessMethodOptionsByBiasType = {
  PRETRAIN: [
    { value: 'ALL', label: 'ALL (All Metrics)' },
    { value: 'STATISTICAL-PARITY-DIFFERENCE', label: 'Statistical Parity Difference' },
    { value: 'DISPARATE-IMPACT', label: 'Disparate Impact' },
    { value: 'SMOOTHED_EMPIRICAL_DIFFERENTIAL_FAIRNESS', label: 'Smoothed Empirical Differential Fairness' },
    { value: 'CONSISTENCY', label: 'Consistency' }
  ],
  POSTTRAIN: [
    { value: 'ALL', label: 'ALL (All Metrics)' },
    { value: 'STATISTICAL_PARITY', label: 'Statistical Parity' },
    { value: 'DISPARATE_IMPACT', label: 'Disparate Impact' },
    { value: 'FOUR_FIFTHS_RULE', label: 'Four Fifths Rule' },
    { value: 'COHEN_D', label: 'Cohen D' },
    { value: 'EQUAL_OPPORTUNITY_DIFFERENCE', label: 'Equal Opportunity Difference' },
    { value: 'FALSE_POSITIVE_RATE_DIFFERENCE', label: 'False Positive Rate Difference' },
    { value: 'FALSE_NEGATIVE_RATE_DIFFERENCE', label: 'False Negative Rate Difference' },
    { value: 'TRUE_NEGATIVE_RATE_DIFFERENCE', label: 'True Negative Rate Difference' },
    { value: 'AVERAGE_ODDS_DIFFERENCE', label: 'Average Odds Difference' },
    { value: 'ACCURACY_DIFFERENCE', label: 'Accuracy Difference' },
    { value: 'Z_TEST_DIFFERENCE', label: 'Z Test Difference' },
    { value: 'ABROCA', label: 'ABROCA' }
  ]
};

export const mvpState = reactive({
  apiConfig: { ...FALLBACK_API_CONFIG },
  uiTab: 'explainability',

  uploadedTargetClassifier: 'LogisticRegression',

  showExplainPreview: false,
  explainSampleLimit: 3,

  diceInputIndex: 0,
  diceDesiredClass: 'opposite',
  diceTotalCounterfactuals: 3,
  diceImmutableFeaturesInput: '',
  dicePermittedRangeInput: '',

  selectedFairnessDatasetKey: 'fairness-banking-loan',
  fairnessBiasType: 'PRETRAIN',
  fairnessMethodType: 'ALL',
  fairnessTaskType: 'CLASSIFICATION',
  fairnessLabel: '',
  fairnessPredLabel: 'labels_pred',
  fairnessFavorableOutcome: '1',
  fairnessProtectedAttributesInput: '',
  fairnessPrivilegedGroupsInput: '',

  robustnessAttackOptions: [...DEFAULT_ROBUSTNESS_ATTACKS],
  selectedRobustnessAttacks: [DEFAULT_ROBUSTNESS_ATTACKS[0]],

  datasetColumns: [],

  evaluationInProgress: false,
  reportDownloadInProgress: false,
  currentStepMessage: '',
  evaluationError: '',
  evaluationSuccess: '',
  reportStatus: '',
  tenetRunStatuses: [],

  explainabilityCards: [],
  diceResult: null,
  generatedBatchByTenet: { Explainability: null, Fairness: null, Robustness: null },
  selectedDownloadTenet: ''
});

function tenetForUiTab(uiTab) {
  if (uiTab === 'fairness') return 'Fairness';
  if (uiTab === 'robustness') return 'Robustness';
  return 'Explainability';
}

function explainabilityModeForUiTab(uiTab) {
  return uiTab === 'counterfactuals' ? 'DICE' : 'STANDARD';
}

export const availableDownloadTenets = computed(() =>
  Object.keys(mvpState.generatedBatchByTenet).filter(tenetName => Number(mvpState.generatedBatchByTenet[tenetName]) > 0)
);

export const canDownloadReport = computed(
  () => !mvpState.evaluationInProgress && !mvpState.reportDownloadInProgress && availableDownloadTenets.value.length > 0
);

export const fairnessMethodOptions = computed(
  () => fairnessMethodOptionsByBiasType[mvpState.fairnessBiasType] || fairnessMethodOptionsByBiasType.PRETRAIN
);

export const canEvaluate = computed(() => {
  if (mvpState.evaluationInProgress) {
    return false;
  }

  const tenet = tenetForUiTab(mvpState.uiTab);
  if (tenet === 'Robustness') {
    return buildExplainabilityDatasetOption() !== null && mvpState.selectedRobustnessAttacks.length > 0;
  }
  if (tenet === 'Explainability') {
    return buildExplainabilityDatasetOption() !== null;
  }
  return validateFairnessInputs(false);
});

function joinUrl(baseUrl, pathOrUrl) {
  if (!pathOrUrl) {
    return baseUrl;
  }
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${normalizedBase}${normalizedPath}`;
}

function isLocalHostName(hostName) {
  return hostName === 'localhost' || hostName === '127.0.0.1' || hostName === '0.0.0.0';
}

function getAllApiEndpoints(config) {
  return Object.values(config);
}

function containsKnownRemoteHost(config) {
  const endpoints = getAllApiEndpoints(config);
  return endpoints.some(endpointUrl => REMOTE_CONFIG_HOST_KEYWORDS.some(keyword => endpointUrl.includes(keyword)));
}

function containsExternalEndpointsForLocalRuntime(config) {
  return getAllApiEndpoints(config).some(endpointUrl => {
    try {
      return !isLocalHostName(new URL(endpointUrl).hostname);
    } catch (error) {
      return false;
    }
  });
}

function shouldForceLocalApiConfig() {
  return isLocalHostName(window.location.hostname || '');
}

function resolveRuntimeApiConfig(candidateConfig) {
  if (!shouldForceLocalApiConfig()) {
    return candidateConfig;
  }
  if (containsKnownRemoteHost(candidateConfig) || containsExternalEndpointsForLocalRuntime(candidateConfig)) {
    return FALLBACK_API_CONFIG;
  }
  return candidateConfig;
}

function buildApiConfig(configResult) {
  const workbenchBase = configResult?.Workbench || 'http://localhost:30020';
  const explainabilityBase = configResult?.Explainability_Demo || 'http://localhost:8002';
  const diceBase = configResult?.DiceCounterfactual || 'http://localhost:8004';
  const fairnessBase = configResult?.Fairness || 'http://localhost:8000';
  const securityWrapperBase = configResult?.SecurityWrapper || 'http://localhost:30023';
  const securityWorkbenchBase = configResult?.SecurityWorkbench || securityWrapperBase;
  const reportBase = configResult?.WorkbenchReport || 'http://localhost:30021';

  return {
    workbenchData: joinUrl(workbenchBase, configResult?.Workbench_Data || '/v1/workbench/data'),
    workbenchModel: joinUrl(workbenchBase, configResult?.Workbench_Model || '/v1/workbench/model'),
    workbenchAddData: joinUrl(workbenchBase, configResult?.Workbench_AddData || '/v1/workbench/adddata'),
    workbenchAddModel: joinUrl(workbenchBase, configResult?.Workbench_AddModel || '/v1/workbench/addmodel'),
    batchGeneration: joinUrl(workbenchBase, configResult?.BatchGeneration || '/v1/workbench/batchgeneration'),
    explainMethods: joinUrl(explainabilityBase, configResult?.ExplainWorkMethods || '/rai/v1/explainability/methods/get'),
    explainGet: joinUrl(explainabilityBase, '/rai/v1/explainability/explanation/get'),
    explainReport: joinUrl(explainabilityBase, configResult?.ExplainGenReport || '/rai/v1/explainability/report/generate'),
    diceCounterfactual: joinUrl(diceBase, configResult?.DiceCounterfactualGenerate || '/rai/v1/dice/counterfactual'),
    diceReport: joinUrl(diceBase, configResult?.DiceCounterfactualReport || '/rai/v1/dice/report'),
    fairnessReport: joinUrl(fairnessBase, configResult?.FairGenReport || '/api/v1/fairness/wrapper/batchId'),
    fairnessDownload: joinUrl(fairnessBase, configResult?.FairnessWrapDownload || '/api/v1/fairness/wrapper/download'),
    securityApplicableAttacks: joinUrl(securityWrapperBase, configResult?.security_applicableAttack || '/rai/v1/security_workbench/attack'),
    securityValidateAttackRun: joinUrl(securityWorkbenchBase, configResult?.SecurityValidateAttackRun || '/rai/v1/security_workbench/validateattackrun'),
    securityReport: joinUrl(securityWorkbenchBase, configResult?.SecurityReport || '/rai/v1/security_workbench/runallattacks'),
    downloadWorkReport: joinUrl(reportBase, configResult?.DownloadWorkReport || '/v1/report/downloadreport')
  };
}

async function loadApiConfig() {
  try {
    const savedConfig = window.localStorage.getItem('res');
    if (savedConfig) {
      const parsedSavedConfig = JSON.parse(savedConfig);
      if (parsedSavedConfig?.result) {
        mvpState.apiConfig = resolveRuntimeApiConfig(buildApiConfig(parsedSavedConfig.result));
        return;
      }
    }

    const latestConfig = await request(runtimeState.masterUrl);
    if (latestConfig?.result) {
      window.localStorage.setItem('res', JSON.stringify(latestConfig));
      mvpState.apiConfig = resolveRuntimeApiConfig(buildApiConfig(latestConfig.result));
    } else {
      mvpState.apiConfig = resolveRuntimeApiConfig(FALLBACK_API_CONFIG);
    }
  } catch (error) {
    mvpState.apiConfig = resolveRuntimeApiConfig(FALLBACK_API_CONFIG);
  }
}

function parseCsvLine(csvLine) {
  const parsedColumns = [];
  let currentValue = '';
  let insideQuotes = false;

  for (let index = 0; index < csvLine.length; index += 1) {
    const currentChar = csvLine[index];
    if (currentChar === '"') {
      insideQuotes = !insideQuotes;
      continue;
    }
    if (currentChar === ',' && !insideQuotes) {
      parsedColumns.push(currentValue);
      currentValue = '';
      continue;
    }
    currentValue += currentChar;
  }

  parsedColumns.push(currentValue);
  return parsedColumns;
}

function extractCsvColumns(csvText) {
  const firstRow = csvText.split(/\r?\n/).find(line => line.trim().length > 0) || '';
  return parseCsvLine(firstRow).map(columnName => columnName.replace(/^["']|["']$/g, '').trim());
}

async function fetchAssetFile(assetPath, outputFileName, defaultMimeType) {
  const response = await fetch(encodeURI(assetPath));
  if (!response.ok) {
    throw new Error(`Unable to fetch ${outputFileName} from assets.`);
  }
  const assetBlob = await response.blob();
  return new File([assetBlob], outputFileName, { type: assetBlob.type || defaultMimeType });
}

async function detectTargetLabel(datasetFile) {
  try {
    const csvHeaderSample = await datasetFile.slice(0, 8192).text();
    const columns = extractCsvColumns(csvHeaderSample);
    if (columns.length === 0) {
      return 'TARGET';
    }
    const preferredColumns = ['TARGET', 'target', 'label', 'Label', 'class', 'Class', 'y'];
    const matchedPreferredColumn = preferredColumns.find(columnName => columns.includes(columnName));
    return matchedPreferredColumn || columns[columns.length - 1];
  } catch (error) {
    return 'TARGET';
  }
}

function getLoggedInUser() {
  return authState.account?.login || 'admin';
}

function getUserScopeSuffix() {
  const normalizedUser = String(getLoggedInUser() || 'admin')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalizedUser || 'admin';
}

function stripExtension(fileName) {
  return String(fileName || '').replace(/\.[^.]+$/, '');
}

function normalizeRecordValue(value) {
  return String(value || '').trim().toLowerCase();
}

async function getAllDatasets(userId) {
  const requestBody = new FormData();
  requestBody.append('userId', userId);
  const response = await request(mvpState.apiConfig.workbenchData, { method: 'POST', body: requestBody });
  return Array.isArray(response) ? response : [];
}

async function getAllModels(userId) {
  const requestBody = new FormData();
  requestBody.append('userId', userId);
  const response = await request(mvpState.apiConfig.workbenchModel, { method: 'POST', body: requestBody });
  return Array.isArray(response) ? response : [];
}

function findDatasetRecord(datasetRecords, selectedDatasetOption) {
  const expectedName = normalizeRecordValue(selectedDatasetOption.datasetName);
  const expectedFileName = normalizeRecordValue(selectedDatasetOption.datasetFileName);
  const expectedStem = expectedFileName.replace(/\.[^.]+$/, '');

  return (
    datasetRecords.find(datasetRecord => {
      const datasetName = normalizeRecordValue(datasetRecord?.dataSetName);
      const fileName = normalizeRecordValue(datasetRecord?.fileName);
      const fileStem = fileName.replace(/\.[^.]+$/, '');
      return datasetName === expectedName || fileName === expectedFileName || fileStem === expectedStem || datasetName === expectedStem;
    }) || null
  );
}

function isUsableModelRecord(modelRecord) {
  if (!modelRecord || !modelRecord.modelId) {
    return false;
  }
  const requiredFields = ['useModelApi', 'taskType', 'targetDataType', 'targetClassifier'];
  return requiredFields.every(fieldName => String(modelRecord?.[fieldName] || '').trim().length > 0);
}

function findModelRecord(modelRecords, selectedDatasetOption) {
  const expectedName = normalizeRecordValue(selectedDatasetOption.modelName);
  const expectedFileName = normalizeRecordValue(selectedDatasetOption.modelFileName);
  const expectedStem = expectedFileName.replace(/\.[^.]+$/, '');

  return (
    modelRecords.find(modelRecord => {
      if (!isUsableModelRecord(modelRecord)) {
        return false;
      }
      const modelName = normalizeRecordValue(modelRecord?.modelName);
      const fileName = normalizeRecordValue(modelRecord?.fileName);
      const fileStem = fileName.replace(/\.[^.]+$/, '');
      return modelName === expectedName || fileName === expectedFileName || fileStem === expectedStem || modelName === expectedStem;
    }) || null
  );
}

async function ensureDatasetExists(userId, selectedDatasetOption, datasetFile, targetLabel) {
  const existingDatasets = await getAllDatasets(userId);
  if (findDatasetRecord(existingDatasets, selectedDatasetOption)) {
    return;
  }

  const payload = {
    dataFileName: selectedDatasetOption.datasetName,
    dataType: selectedDatasetOption.targetDataType,
    groundTruthClassNames: null,
    groundTruthClassLabel: targetLabel
  };

  const datasetFormData = new FormData();
  datasetFormData.append('userId', userId);
  datasetFormData.append('Payload', JSON.stringify(payload));
  datasetFormData.append('DataFile', datasetFile);

  const response = await request(mvpState.apiConfig.workbenchAddData, { method: 'POST', body: datasetFormData });
  if (typeof response === 'string' && response.toLowerCase().includes('failed')) {
    throw new Error(response);
  }
}

async function ensureModelExists(userId, selectedDatasetOption, modelFile) {
  const existingModels = await getAllModels(userId);
  if (findModelRecord(existingModels, selectedDatasetOption)) {
    return;
  }

  const payload = {
    modelName: selectedDatasetOption.modelName,
    targetDataType: selectedDatasetOption.targetDataType,
    taskType: selectedDatasetOption.taskType,
    targetClassifier: selectedDatasetOption.targetClassifier,
    useModelApi: 'No',
    modelEndPoint: 'NA',
    data: 'NA',
    prediction: 'NA',
    imageClassificationTypes: 'binary classification'
  };

  const modelFormData = new FormData();
  modelFormData.append('userId', userId);
  modelFormData.append('Payload', JSON.stringify(payload));
  modelFormData.append('ModelFile', modelFile);

  const response = await request(mvpState.apiConfig.workbenchAddModel, { method: 'POST', body: modelFormData });
  if (typeof response === 'string' && response.toLowerCase().includes('failed')) {
    throw new Error(response);
  }
}

function sleep(milliseconds) {
  return new Promise(resolve => {
    window.setTimeout(resolve, milliseconds);
  });
}

async function resolveRegisteredAssets(userId, selectedDatasetOption) {
  const maxAttempts = 5;
  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const [allDatasets, allModels] = await Promise.all([getAllDatasets(userId), getAllModels(userId)]);
    const selectedDatasetInfo = findDatasetRecord(allDatasets, selectedDatasetOption);
    const selectedModelInfo = findModelRecord(allModels, selectedDatasetOption);

    if (selectedDatasetInfo?.dataId && selectedModelInfo?.modelId) {
      return { selectedDatasetInfo, selectedModelInfo };
    }
    await sleep(900);
  }

  throw new Error('Model or dataset registration lookup failed.');
}

function getSelectedClassifierModelAsset() {
  const normalizedSelection = String(mvpState.uploadedTargetClassifier || '').trim().toUpperCase();
  return classifierModelAssets.find(asset => asset.classifierLabel.toUpperCase() === normalizedSelection) || null;
}

function buildExplainabilityDatasetOption() {
  const selectedModelAsset = getSelectedClassifierModelAsset();
  if (!selectedModelAsset) {
    return null;
  }

  const userScope = getUserScopeSuffix();
  const modelFileName = selectedModelAsset.modelFileName;
  const modelName = `${stripExtension(modelFileName)}_${userScope}_mvp_home`;

  return {
    label: `${FIXED_DATASET_NAME}_${userScope}::${modelName}`,
    datasetName: `${FIXED_DATASET_NAME}_${userScope}`,
    datasetFileName: FIXED_DATASET_FILE_NAME,
    datasetAssetPath: FIXED_DATASET_ASSET_PATH,
    modelName,
    modelFileName,
    modelAssetPath: selectedModelAsset.modelAssetPath,
    taskType: 'CLASSIFICATION',
    targetDataType: 'Tabular',
    targetClassifier: selectedModelAsset.normalizedClassifier
  };
}

function getSelectedFairnessDatasetOption() {
  return fairnessDatasetOptions.find(option => option.key === mvpState.selectedFairnessDatasetKey) || null;
}

function getFairnessModelAsset(selectedDatasetOption) {
  const hiddenModelLabel = selectedDatasetOption?.hiddenModelLabel || 'LogisticRegression';
  return classifierModelAssets.find(asset => asset.classifierLabel === hiddenModelLabel) || null;
}

function buildFairnessDatasetOption() {
  const fairnessDatasetOption = getSelectedFairnessDatasetOption();
  const selectedModelAsset = getFairnessModelAsset(fairnessDatasetOption);
  if (!fairnessDatasetOption || !selectedModelAsset) {
    return null;
  }

  const userScope = getUserScopeSuffix();
  const modelFileName = selectedModelAsset.modelFileName;
  const modelName = `${stripExtension(modelFileName)}_${userScope}_fairness_hidden`;

  return {
    label: `${fairnessDatasetOption.datasetName}_${userScope}::${mvpState.fairnessBiasType.toLowerCase()}`,
    datasetName: `${fairnessDatasetOption.datasetName}_${userScope}`,
    datasetFileName: fairnessDatasetOption.datasetFileName,
    datasetAssetPath: fairnessDatasetOption.datasetAssetPath,
    modelName,
    modelFileName,
    modelAssetPath: selectedModelAsset.modelAssetPath,
    taskType: 'CLASSIFICATION',
    targetDataType: 'Tabular',
    targetClassifier: selectedModelAsset.normalizedClassifier
  };
}

function normalizeFairnessMethodType() {
  const allowedMethods = fairnessMethodOptions.value.map(option => option.value);
  if (!allowedMethods.includes(mvpState.fairnessMethodType)) {
    mvpState.fairnessMethodType = allowedMethods[0] || 'ALL';
  }
}

export function applyFairnessPreset() {
  const fairnessDatasetOption = getSelectedFairnessDatasetOption();
  if (!fairnessDatasetOption) {
    return;
  }

  const preset = fairnessDatasetOption.presets[mvpState.fairnessBiasType] || fairnessDatasetOption.presets.PRETRAIN;
  mvpState.fairnessLabel = preset.label;
  mvpState.fairnessFavorableOutcome = preset.favorableOutcome;
  mvpState.fairnessProtectedAttributesInput = preset.protectedAttributesInput;
  mvpState.fairnessPrivilegedGroupsInput = preset.privilegedGroupsInput;
  mvpState.fairnessPredLabel = preset.predLabel || 'labels_pred';
  normalizeFairnessMethodType();
}

async function loadFixedDatasetColumns() {
  try {
    const datasetFile = await fetchAssetFile(FIXED_DATASET_ASSET_PATH, FIXED_DATASET_FILE_NAME, 'text/csv');
    const csvHeaderSample = await datasetFile.slice(0, 8192).text();
    mvpState.datasetColumns = extractCsvColumns(csvHeaderSample);
  } catch (error) {
    mvpState.datasetColumns = [];
  }
}

async function loadFairnessDatasetColumns() {
  const fairnessDatasetOption = getSelectedFairnessDatasetOption();
  if (!fairnessDatasetOption) {
    mvpState.datasetColumns = [];
    return;
  }

  try {
    const datasetFile = await fetchAssetFile(
      fairnessDatasetOption.datasetAssetPath,
      fairnessDatasetOption.datasetFileName,
      'text/csv'
    );
    const csvHeaderSample = await datasetFile.slice(0, 8192).text();
    mvpState.datasetColumns = extractCsvColumns(csvHeaderSample);
  } catch (error) {
    mvpState.datasetColumns = [];
  }
}

function extractAttackNames(payload) {
  const attackNames = new Set();

  function collectNames(value) {
    if (value === null || value === undefined) {
      return;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed) {
        attackNames.add(trimmed);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach(collectNames);
      return;
    }
    if (typeof value === 'object') {
      const candidateKeys = ['attackName', 'attack', 'name', 'method'];
      for (const key of candidateKeys) {
        if (typeof value[key] === 'string' && value[key].trim()) {
          attackNames.add(value[key].trim());
        }
      }
      Object.values(value).forEach(collectNames);
    }
  }

  collectNames(payload);
  return Array.from(attackNames);
}

async function loadRobustnessAttackOptions() {
  const selectedDatasetOption = buildExplainabilityDatasetOption();
  if (!selectedDatasetOption) {
    mvpState.robustnessAttackOptions = [...DEFAULT_ROBUSTNESS_ATTACKS];
    mvpState.selectedRobustnessAttacks = [DEFAULT_ROBUSTNESS_ATTACKS[0]];
    return;
  }

  try {
    const requestPayload = new FormData();
    requestPayload.append('TargetClassifier', selectedDatasetOption.targetClassifier);
    requestPayload.append('TargetDataType', selectedDatasetOption.targetDataType);

    const attacksResponse = await request(mvpState.apiConfig.securityApplicableAttacks, {
      method: 'POST',
      body: requestPayload
    });
    const extractedAttacks = extractAttackNames(attacksResponse);

    if (extractedAttacks.length > 0) {
      mvpState.robustnessAttackOptions = extractedAttacks;
      mvpState.selectedRobustnessAttacks = mvpState.selectedRobustnessAttacks.filter(attack =>
        extractedAttacks.includes(attack)
      );
      if (mvpState.selectedRobustnessAttacks.length === 0) {
        mvpState.selectedRobustnessAttacks = [extractedAttacks[0]];
      }
    } else {
      mvpState.robustnessAttackOptions = [...DEFAULT_ROBUSTNESS_ATTACKS];
      mvpState.selectedRobustnessAttacks = [DEFAULT_ROBUSTNESS_ATTACKS[0]];
    }
  } catch (error) {
    mvpState.robustnessAttackOptions = [...DEFAULT_ROBUSTNESS_ATTACKS];
    mvpState.selectedRobustnessAttacks = [DEFAULT_ROBUSTNESS_ATTACKS[0]];
  }
}

function splitCsvInput(rawValue) {
  return String(rawValue || '')
    .split(',')
    .map(item => item.trim())
    .filter(item => item.length > 0);
}

function parseNestedGroups(rawValue) {
  const normalized = String(rawValue || '').trim();
  if (!normalized) {
    return [];
  }
  return normalized
    .split(';')
    .map(groupText =>
      groupText
        .split(',')
        .map(item => item.trim())
        .filter(item => item.length > 0)
    )
    .filter(group => group.length > 0);
}

function validateFairnessInputs(updateErrorState) {
  if (!mvpState.fairnessProtectedAttributesInput.trim()) {
    if (updateErrorState) {
      mvpState.evaluationError = 'Fairness requires protected attribute input (for example: gender).';
    }
    return false;
  }
  if (!mvpState.fairnessLabel.trim()) {
    if (updateErrorState) {
      mvpState.evaluationError = 'Fairness requires a label column.';
    }
    return false;
  }
  if (mvpState.fairnessBiasType === 'POSTTRAIN' && !mvpState.fairnessPredLabel.trim()) {
    if (updateErrorState) {
      mvpState.evaluationError = 'Post-train fairness requires a prediction label column.';
    }
    return false;
  }
  return true;
}

function extractBatchByTenet(batchGenerationResponse, tenetId) {
  if (!Array.isArray(batchGenerationResponse)) {
    return null;
  }
  return batchGenerationResponse.find(item => Number(item?.TenetId) === tenetId) || batchGenerationResponse[0] || null;
}

function setTenetStatus(tenetName, state, message, batchId) {
  const existingIndex = mvpState.tenetRunStatuses.findIndex(item => item.name === tenetName);
  const statusPayload = { name: tenetName, state, message, batchId: batchId ?? undefined };
  if (existingIndex >= 0) {
    mvpState.tenetRunStatuses[existingIndex] = statusPayload;
    return;
  }
  mvpState.tenetRunStatuses = [...mvpState.tenetRunStatuses, statusPayload];
}

function updateDownloadSelection() {
  const available = availableDownloadTenets.value;
  if (available.length === 0) {
    mvpState.selectedDownloadTenet = '';
    return;
  }
  if (!available.includes(mvpState.selectedDownloadTenet)) {
    mvpState.selectedDownloadTenet = available[0];
  }
}

function getPreferredExplainMethods(availableMethods, includeGlobalKernel) {
  const selectedMethods = [];
  if (availableMethods.includes('LIME-TABULAR')) {
    selectedMethods.push({ method: 'LIME-TABULAR', scope: 'LOCAL' });
  }
  if (includeGlobalKernel && availableMethods.includes('KERNEL-EXPLAINER')) {
    selectedMethods.push({ method: 'KERNEL-EXPLAINER', scope: 'GLOBAL' });
  }
  if (selectedMethods.length > 0) {
    return selectedMethods;
  }
  return availableMethods.slice(0, 1).map(methodName => ({
    method: methodName,
    scope: methodName.includes('KERNEL') ? 'GLOBAL' : 'LOCAL'
  }));
}

function mapExplainResponseToCards(explainResponse, rowLimit) {
  const explanationItems = Array.isArray(explainResponse?.explanation) ? explainResponse.explanation : [];

  return explanationItems.map(explanationItem => {
    const candidateRows =
      explanationItem?.featureImportance ||
      explanationItem?.shapImportanceText ||
      explanationItem?.attributionsText ||
      explanationItem?.anchor ||
      explanationItem?.timeSeriesForecast ||
      explanationItem?.shapValues ||
      [];

    const normalizedRows = Array.isArray(candidateRows)
      ? candidateRows
          .map(row => ({
            prediction: row?.modelPrediction || '-',
            inputRow: Array.isArray(row?.inputRow) ? row.inputRow : [],
            explanation: Array.isArray(row?.explanation) ? row.explanation : []
          }))
          .slice(0, rowLimit)
      : [];

    return {
      methodName: explanationItem?.methodName || 'Explainability',
      methodDescription: explanationItem?.methodDescription || '',
      rows: normalizedRows
    };
  });
}

function isRecoverableKernelFailure(error) {
  const message = String(error?.message || '').toLowerCase();
  return (
    error instanceof TypeError ||
    message.includes('unknown error') ||
    message.includes('connection reset') ||
    message.includes('failed to fetch')
  );
}

function getSafeExplainSampleLimit() {
  const sampleLimit = Math.round(Number(mvpState.explainSampleLimit));
  if (!Number.isFinite(sampleLimit)) {
    return 3;
  }
  return Math.max(1, Math.min(25, sampleLimit));
}

async function generateExplainabilityBatchAndReport(userId, datasetId, modelId, selectedDatasetOption, methodsToRun) {
  mvpState.currentStepMessage = 'Generating explainability batch...';
  const batchGenerationResponse = await request(mvpState.apiConfig.batchGeneration, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      title: `MVP Explainability - ${selectedDatasetOption.datasetName}`,
      modelId,
      dataId: datasetId,
      tenetName: ['Explainability'],
      appExplanationMethods: methodsToRun.map(item => item.method)
    })
  });

  const explainBatch = extractBatchByTenet(batchGenerationResponse, 1.1);
  const explainBatchId = Number(explainBatch?.BatchId || 0);
  if (!explainBatchId) {
    throw new Error('Batch was created without a valid BatchId for explainability.');
  }

  mvpState.currentStepMessage = 'Generating explainability report...';
  const explainReportResponse = await request(mvpState.apiConfig.explainReport, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batchId: explainBatchId })
  });

  const reportMessage =
    explainReportResponse?.status === 'SUCCESS'
      ? 'Explainability report generated successfully.'
      : explainReportResponse?.message || 'Explainability report generation returned non-success.';

  return { batchId: explainBatchId, reportMessage };
}

async function runExplainabilityFlow(userId, datasetId, modelId, selectedDatasetOption) {
  setTenetStatus('Explainability', 'running', 'Fetching applicable methods...');
  mvpState.currentStepMessage = 'Fetching applicable explainability methods...';

  const applicableMethodsResponse = await request(mvpState.apiConfig.explainMethods, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ modelId, datasetId, scope: null })
  });

  const applicableMethods = Array.isArray(applicableMethodsResponse?.methods) ? applicableMethodsResponse.methods : [];
  if (applicableMethods.length === 0) {
    throw new Error('No explainability method was returned for this model/dataset pair.');
  }

  const preferredMethods = getPreferredExplainMethods(applicableMethods, false);
  const hasKernelMethod = preferredMethods.some(item => item.method === 'KERNEL-EXPLAINER');
  const limeOnlyMethods = preferredMethods.filter(item => item.method !== 'KERNEL-EXPLAINER');
  const canRetryWithoutKernel = hasKernelMethod && limeOnlyMethods.length > 0;

  let methodsUsedForRun = preferredMethods;
  let explainBatchId = null;
  let reportMessage = '';
  let fallbackNote = '';

  try {
    const explainRunResponse = await generateExplainabilityBatchAndReport(
      userId,
      datasetId,
      modelId,
      selectedDatasetOption,
      methodsUsedForRun
    );
    explainBatchId = explainRunResponse.batchId;
    reportMessage = explainRunResponse.reportMessage;
  } catch (error) {
    if (!canRetryWithoutKernel || !isRecoverableKernelFailure(error)) {
      throw error;
    }

    mvpState.currentStepMessage = 'Kernel explainer failed. Retrying with LIME only...';
    methodsUsedForRun = limeOnlyMethods;
    const explainRunResponse = await generateExplainabilityBatchAndReport(
      userId,
      datasetId,
      modelId,
      selectedDatasetOption,
      methodsUsedForRun
    );
    explainBatchId = explainRunResponse.batchId;
    reportMessage = explainRunResponse.reportMessage;
    fallbackNote = ' Kernel explainer was skipped because the explain service became unstable for this run.';
  }

  mvpState.generatedBatchByTenet.Explainability = explainBatchId;

  let previewMessage = '';
  mvpState.explainabilityCards = [];

  if (mvpState.showExplainPreview) {
    try {
      mvpState.currentStepMessage = 'Loading sample explanations...';
      const safeSampleLimit = getSafeExplainSampleLimit();
      const explainResults = [];

      for (const selectedMethod of methodsUsedForRun) {
        const explainResponse = await request(mvpState.apiConfig.explainGet, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            modelId,
            datasetId,
            preprocessorId: null,
            scope: selectedMethod.scope,
            method: selectedMethod.method,
            sampleLimit: safeSampleLimit
          })
        });
        explainResults.push(...mapExplainResponseToCards(explainResponse, safeSampleLimit));
      }

      mvpState.explainabilityCards = explainResults;
      if (explainResults.length === 0) {
        previewMessage = ' Report is ready, but no preview rows were returned by the service.';
      }
    } catch (previewError) {
      previewMessage = ` Report is ready. Preview could not be loaded (${resolveErrorMessage(previewError)}).`;
    }
  } else {
    previewMessage = ' Preview is off for faster run.';
  }

  const finalReportMessage = `${reportMessage}${fallbackNote}${previewMessage}`.trim();
  mvpState.reportStatus = finalReportMessage;
  setTenetStatus('Explainability', 'success', finalReportMessage, explainBatchId);
}

function parseDiceImmutableFeatures(rawValue) {
  return Array.from(
    new Set(
      String(rawValue || '')
        .split(/[,\n]/)
        .map(featureName => featureName.trim())
        .filter(featureName => featureName.length > 0)
    )
  );
}

function parseDicePermittedRange(rawValue) {
  const normalizedValue = String(rawValue || '').trim();
  if (!normalizedValue) {
    return undefined;
  }

  let parsedValue;
  try {
    parsedValue = JSON.parse(normalizedValue);
  } catch (error) {
    throw new Error('Permitted range must be valid JSON like {"income":[20000,100000],"hours_per_week":[20,60]}.');
  }

  if (!parsedValue || Array.isArray(parsedValue) || typeof parsedValue !== 'object') {
    throw new Error('Permitted range must be a JSON object that maps feature names to [min, max] arrays.');
  }

  const normalizedRange = {};
  for (const [featureName, rangeValue] of Object.entries(parsedValue)) {
    if (!Array.isArray(rangeValue) || rangeValue.length !== 2) {
      throw new Error(`Permitted range for "${featureName}" must be a two-item array like [min, max].`);
    }
    const [minValue, maxValue] = rangeValue;
    if (typeof minValue !== 'number' || Number.isNaN(minValue) || typeof maxValue !== 'number' || Number.isNaN(maxValue)) {
      throw new Error(`Permitted range for "${featureName}" must contain numeric min/max values.`);
    }
    normalizedRange[featureName] = [minValue, maxValue];
  }
  return normalizedRange;
}

function buildDiceConstraintPayload() {
  const immutableFeatures = parseDiceImmutableFeatures(mvpState.diceImmutableFeaturesInput);
  const permittedRange = parseDicePermittedRange(mvpState.dicePermittedRangeInput);

  const payload = {};
  if (immutableFeatures.length > 0) {
    payload.immutable_features = immutableFeatures;
  }
  if (permittedRange) {
    payload.permitted_range = permittedRange;
  }
  return payload;
}

async function runDiceFlow(userId, datasetId, modelId, selectedDatasetOption) {
  const diceConstraintPayload = buildDiceConstraintPayload();
  setTenetStatus('Explainability', 'running', 'Generating DiCE counterfactuals...');
  mvpState.currentStepMessage = 'Generating DiCE batch...';

  const batchGenerationResponse = await request(mvpState.apiConfig.batchGeneration, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      title: `MVP DiCE - ${selectedDatasetOption.datasetName}`,
      modelId,
      dataId: datasetId,
      tenetName: ['Explainability'],
      appExplanationMethods: ['DICE-COUNTERFACTUAL']
    })
  });

  const diceBatch = extractBatchByTenet(batchGenerationResponse, 1.1);
  const diceBatchId = Number(diceBatch?.BatchId || 0);
  if (!diceBatchId) {
    throw new Error('Batch was created without a valid BatchId for DiCE.');
  }
  mvpState.generatedBatchByTenet.Explainability = diceBatchId;

  mvpState.currentStepMessage = 'Generating DiCE counterfactual preview...';
  const dicePreviewResponse = await request(mvpState.apiConfig.diceCounterfactual, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      modelId,
      datasetId,
      inputIndex: mvpState.diceInputIndex,
      desiredClass: mvpState.diceDesiredClass,
      totalCounterfactuals: mvpState.diceTotalCounterfactuals,
      ...diceConstraintPayload
    })
  });

  mvpState.diceResult = dicePreviewResponse?.result || null;
  if (!mvpState.diceResult) {
    throw new Error('DiCE did not return any counterfactuals for the selected request.');
  }

  mvpState.currentStepMessage = 'Generating DiCE report...';
  const diceReportResponse = await request(mvpState.apiConfig.diceReport, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      batchId: diceBatchId,
      inputIndex: mvpState.diceInputIndex,
      desiredClass: mvpState.diceDesiredClass,
      totalCounterfactuals: mvpState.diceTotalCounterfactuals,
      ...diceConstraintPayload
    })
  });

  const reportMessage =
    diceReportResponse?.status === 'SUCCESS'
      ? 'DiCE report generated successfully.'
      : diceReportResponse?.message || 'DiCE report generation returned non-success.';

  mvpState.reportStatus = reportMessage;
  setTenetStatus('Explainability', 'success', reportMessage, diceBatchId);
}

async function runFairnessFlow(userId, datasetId, modelId, detectedTargetLabel, selectedDatasetOption) {
  mvpState.currentStepMessage = 'Generating fairness batch...';
  setTenetStatus('Fairness', 'running', 'Preparing fairness payload...');

  const protectedAttributes = splitCsvInput(mvpState.fairnessProtectedAttributesInput);
  if (protectedAttributes.length === 0) {
    throw new Error('Fairness needs at least one protected attribute.');
  }

  const privilegedGroups = parseNestedGroups(mvpState.fairnessPrivilegedGroupsInput);
  const normalizedPrivilegedGroups = privilegedGroups.length > 0 ? privilegedGroups : protectedAttributes.map(() => []);

  const fairnessPayload = {
    userId,
    title: `MVP Fairness - ${selectedDatasetOption.datasetName}`,
    modelId,
    dataId: datasetId,
    tenetName: ['Fairness'],
    biasType: mvpState.fairnessBiasType,
    methodType: mvpState.fairnessMethodType,
    taskType: mvpState.fairnessTaskType,
    label: mvpState.fairnessLabel.trim() || detectedTargetLabel,
    favorableOutcome: mvpState.fairnessFavorableOutcome.trim() || '1',
    protectedAttribute: protectedAttributes,
    privilegedGroup: normalizedPrivilegedGroups,
    mitigationType: 'AUDIT',
    mitigationTechnique: ''
  };
  if (mvpState.fairnessBiasType === 'POSTTRAIN' && mvpState.fairnessPredLabel.trim()) {
    fairnessPayload.predLabel = mvpState.fairnessPredLabel.trim();
  }

  const batchGenerationResponse = await request(mvpState.apiConfig.batchGeneration, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fairnessPayload)
  });
  const fairnessBatch = extractBatchByTenet(batchGenerationResponse, 2.2);
  const fairnessBatchId = fairnessBatch?.BatchId || null;
  mvpState.generatedBatchByTenet.Fairness = fairnessBatchId;

  if (!fairnessBatchId) {
    throw new Error('Fairness batch was not generated.');
  }

  mvpState.currentStepMessage = 'Running fairness analysis...';
  await request(mvpState.apiConfig.fairnessReport, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Batch_id: fairnessBatchId })
  });

  mvpState.reportStatus = 'Fairness run submitted. You can download once generation finishes.';
  setTenetStatus('Fairness', 'success', 'Fairness analysis triggered successfully.', fairnessBatchId);
}

async function runRobustnessFlow(userId, datasetId, modelId, selectedDatasetOption) {
  mvpState.currentStepMessage = 'Generating robustness batch...';
  setTenetStatus('Robustness', 'running', 'Preparing robustness payload...');

  const effectiveAttacks =
    mvpState.selectedRobustnessAttacks.length > 0 ? mvpState.selectedRobustnessAttacks : [DEFAULT_ROBUSTNESS_ATTACKS[0]];

  const batchGenerationResponse = await request(mvpState.apiConfig.batchGeneration, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId,
      title: `MVP Robustness - ${selectedDatasetOption.datasetName}`,
      modelId,
      dataId: datasetId,
      tenetName: ['Security'],
      appAttacks: effectiveAttacks
    })
  });
  const robustnessBatch = extractBatchByTenet(batchGenerationResponse, 3.3);
  const robustnessBatchId = robustnessBatch?.BatchId || null;
  mvpState.generatedBatchByTenet.Robustness = robustnessBatchId;

  if (!robustnessBatchId) {
    throw new Error('Robustness batch was not generated.');
  }

  mvpState.currentStepMessage = 'Validating model compatibility for robustness...';
  setTenetStatus('Robustness', 'running', 'Checking model and runtime compatibility...');
  const validationPayload = new FormData();
  validationPayload.append('batchId', String(robustnessBatchId));
  const validationResponse = await request(mvpState.apiConfig.securityValidateAttackRun, {
    method: 'POST',
    body: validationPayload
  });
  if (validationResponse?.status !== 'SUCCESS') {
    throw new Error(stringifyErrorCandidate(validationResponse?.message) || 'Robustness compatibility validation failed.');
  }

  mvpState.currentStepMessage = 'Running robustness attacks...';
  const requestPayload = new FormData();
  requestPayload.append('batchId', String(robustnessBatchId));
  await request(mvpState.apiConfig.securityReport, { method: 'POST', body: requestPayload });

  mvpState.reportStatus = 'Robustness run submitted. You can download once generation finishes.';
  setTenetStatus('Robustness', 'success', 'Robustness analysis triggered successfully.', robustnessBatchId);
}

function stringifyErrorCandidate(candidate) {
  if (candidate === null || candidate === undefined) {
    return '';
  }
  if (typeof candidate === 'string') {
    const trimmed = candidate.trim();
    if (!trimmed || trimmed === '[object Object]') {
      return '';
    }
    const lowered = trimmed.toLowerCase();
    if (lowered === 'none' || lowered === 'null' || lowered === 'undefined') {
      return '';
    }
    return trimmed;
  }
  if (Array.isArray(candidate)) {
    return candidate
      .map(stringifyErrorCandidate)
      .filter(item => item.length > 0)
      .join(' | ');
  }
  if (typeof candidate === 'object') {
    const preferredKeys = ['detail', 'message', 'error', 'msg', 'title'];
    for (const key of preferredKeys) {
      const parsed = stringifyErrorCandidate(candidate[key]);
      if (parsed) {
        return parsed;
      }
    }
    try {
      const serialized = JSON.stringify(candidate);
      return serialized && serialized !== '{}' ? serialized : '';
    } catch (error) {
      return '';
    }
  }
  return String(candidate);
}

function getServiceLabelFromUrl(requestUrl) {
  const normalizedUrl = (requestUrl || '').toLowerCase();
  if (normalizedUrl.includes('/rai/v1/dice/')) return 'DiCE service';
  if (normalizedUrl.includes('/fairness/')) return 'fairness service';
  if (normalizedUrl.includes('/security')) return 'security service';
  if (normalizedUrl.includes('/explainability/')) return 'explainability service';
  return 'evaluation service';
}

function resolveErrorMessage(error, fallbackMessage = 'Evaluation failed.') {
  if (error instanceof TypeError) {
    return `Network error while contacting the evaluation service. Verify the corresponding service container is running and reachable.`;
  }

  const message = stringifyErrorCandidate(error?.message) || stringifyErrorCandidate(error);
  return message || fallbackMessage;
}

async function isZipBlob(blobContent) {
  if (!blobContent || blobContent.size < 4) {
    return false;
  }
  const headerBytes = new Uint8Array(await blobContent.slice(0, 4).arrayBuffer());
  return headerBytes[0] === 0x50 && headerBytes[1] === 0x4b && [0x03, 0x05, 0x07].includes(headerBytes[2]);
}

function extractDownloadErrorMessage(errorText, fallbackMessage) {
  const normalizedText = String(errorText || '').trim();
  if (!normalizedText) {
    return fallbackMessage;
  }
  try {
    return stringifyErrorCandidate(JSON.parse(normalizedText)) || fallbackMessage;
  } catch (error) {
    return normalizedText.length > 240 ? `${normalizedText.slice(0, 237)}...` : normalizedText;
  }
}

function downloadBlob(blobContent, fileName) {
  const blobUrl = window.URL.createObjectURL(blobContent);
  const downloadAnchor = document.createElement('a');
  downloadAnchor.href = blobUrl;
  downloadAnchor.download = fileName;
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
  window.URL.revokeObjectURL(blobUrl);
}

async function fetchBlob(url, options) {
  const token = getStoredToken();
  const headers = new Headers(options.headers || {});
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  return fetch(url, { ...options, headers });
}

async function downloadWorkbenchReport(batchId, filePrefix) {
  const body = new URLSearchParams();
  body.set('batchId', String(batchId));
  const response = await fetchBlob(mvpState.apiConfig.downloadWorkReport, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString()
  });

  const reportBlob = await response.blob();
  if (!response.ok || !(await isZipBlob(reportBlob))) {
    const errorText = await reportBlob.text();
    throw new Error(
      extractDownloadErrorMessage(errorText, 'Report download returned an invalid archive. The report may not have finished generating.')
    );
  }

  let generatedFileName = `${filePrefix}_report_batch_${batchId}.zip`;
  const contentDisposition = response.headers.get('Content-Disposition');
  if (contentDisposition && contentDisposition.includes('filename=')) {
    const downloadedName = contentDisposition.split('filename=')[1].trim().replace(/"/g, '');
    if (downloadedName) {
      generatedFileName = downloadedName;
    }
  }

  downloadBlob(reportBlob, generatedFileName);
}

async function downloadFairnessReport(batchId) {
  const response = await fetchBlob(mvpState.apiConfig.fairnessDownload, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ Batch_id: batchId })
  });

  let fileName = `fairness_report_batch_${batchId}.zip`;
  const contentDisposition = response.headers.get('Content-Disposition');
  if (contentDisposition && contentDisposition.includes('filename=')) {
    const downloadedName = contentDisposition.split('filename=')[1].trim().replace(/"/g, '');
    if (downloadedName.toLowerCase() !== 'report.zip') {
      fileName = downloadedName;
    }
  }

  const reportBlob = await response.blob();
  if (!response.ok || !(await isZipBlob(reportBlob))) {
    const errorText = await reportBlob.text();
    throw new Error(extractDownloadErrorMessage(errorText, 'Fairness report download returned an invalid archive.'));
  }

  downloadBlob(reportBlob, fileName);
}

function resetEvaluationState() {
  mvpState.evaluationError = '';
  mvpState.evaluationSuccess = '';
  mvpState.reportStatus = '';
  mvpState.currentStepMessage = '';
  mvpState.tenetRunStatuses = [];
  mvpState.explainabilityCards = [];
  mvpState.diceResult = null;
  mvpState.generatedBatchByTenet = { Explainability: null, Fairness: null, Robustness: null };
  mvpState.selectedDownloadTenet = '';
}

export function setUiTab(tab) {
  mvpState.uiTab = tab;
  resetEvaluationState();
  if (tab === 'fairness') {
    applyFairnessPreset();
    return;
  }
  if (tab === 'robustness') {
    void loadRobustnessAttackOptions();
  }
}

export function onUploadedMetaChange() {
  resetEvaluationState();
  void loadRobustnessAttackOptions();
}

export function onFairnessDatasetChange() {
  applyFairnessPreset();
  void loadFairnessDatasetColumns();
  resetEvaluationState();
}

export function onFairnessBiasTypeChange() {
  normalizeFairnessMethodType();
  applyFairnessPreset();
  resetEvaluationState();
}

export function onRobustnessAttackToggle(attackName, isChecked) {
  resetEvaluationState();
  if (isChecked && !mvpState.selectedRobustnessAttacks.includes(attackName)) {
    mvpState.selectedRobustnessAttacks = [...mvpState.selectedRobustnessAttacks, attackName];
    return;
  }
  if (!isChecked) {
    mvpState.selectedRobustnessAttacks = mvpState.selectedRobustnessAttacks.filter(attack => attack !== attackName);
  }
}

export async function initMvpWorkflow() {
  applyFairnessPreset();
  void loadFixedDatasetColumns();
  void loadRobustnessAttackOptions();
  void loadApiConfig();
}

export async function evaluate() {
  if (!canEvaluate.value) {
    return;
  }

  const tenet = tenetForUiTab(mvpState.uiTab);
  const selectedDatasetOption = tenet === 'Fairness' ? buildFairnessDatasetOption() : buildExplainabilityDatasetOption();
  if (!selectedDatasetOption) {
    mvpState.evaluationError = 'Dataset or classifier configuration is not available for evaluation.';
    return;
  }
  if (tenet === 'Fairness' && !validateFairnessInputs(true)) {
    return;
  }

  mvpState.evaluationInProgress = true;
  mvpState.evaluationError = '';
  mvpState.evaluationSuccess = '';
  mvpState.reportStatus = '';
  mvpState.currentStepMessage = 'Preparing dataset and model files...';
  mvpState.explainabilityCards = [];
  mvpState.diceResult = null;
  mvpState.generatedBatchByTenet = { Explainability: null, Fairness: null, Robustness: null };
  mvpState.selectedDownloadTenet = '';
  mvpState.tenetRunStatuses = [];

  try {
    const userId = getLoggedInUser();
    const selectedModelAsset = tenet === 'Fairness' ? getFairnessModelAsset(getSelectedFairnessDatasetOption()) : getSelectedClassifierModelAsset();
    if (!selectedModelAsset) {
      throw new Error('Choose a supported classifier before evaluation.');
    }

    const datasetFile = await fetchAssetFile(selectedDatasetOption.datasetAssetPath, selectedDatasetOption.datasetFileName, 'text/csv');
    const modelFile = await fetchAssetFile(selectedModelAsset.modelAssetPath, selectedModelAsset.modelFileName, 'application/octet-stream');
    const detectedTargetLabel = await detectTargetLabel(datasetFile);
    if (!mvpState.fairnessLabel.trim()) {
      mvpState.fairnessLabel = detectedTargetLabel;
    }

    mvpState.currentStepMessage = 'Registering dataset in toolkit workbench...';
    await ensureDatasetExists(userId, selectedDatasetOption, datasetFile, detectedTargetLabel);

    mvpState.currentStepMessage = 'Registering model in toolkit workbench...';
    await ensureModelExists(userId, selectedDatasetOption, modelFile);

    mvpState.currentStepMessage = 'Resolving model and dataset IDs...';
    const { selectedDatasetInfo, selectedModelInfo } = await resolveRegisteredAssets(userId, selectedDatasetOption);
    if (!selectedDatasetInfo?.dataId || !selectedModelInfo?.modelId) {
      throw new Error('Model or dataset registration lookup failed.');
    }

    const datasetId = selectedDatasetInfo.dataId;
    const modelId = selectedModelInfo.modelId;
    const runErrors = [];
    const runSuccess = [];

    if (tenet === 'Explainability') {
      try {
        if (explainabilityModeForUiTab(mvpState.uiTab) === 'DICE') {
          await runDiceFlow(userId, datasetId, modelId, selectedDatasetOption);
        } else {
          await runExplainabilityFlow(userId, datasetId, modelId, selectedDatasetOption);
        }
        runSuccess.push('Explainability');
      } catch (error) {
        runErrors.push(`Explainability: ${resolveErrorMessage(error)}`);
        setTenetStatus('Explainability', 'error', resolveErrorMessage(error));
      }
    } else if (tenet === 'Robustness') {
      try {
        await runRobustnessFlow(userId, datasetId, modelId, selectedDatasetOption);
        runSuccess.push('Robustness');
      } catch (error) {
        runErrors.push(`Robustness: ${resolveErrorMessage(error)}`);
        setTenetStatus('Robustness', 'error', resolveErrorMessage(error));
      }
    } else {
      try {
        await runFairnessFlow(userId, datasetId, modelId, detectedTargetLabel, selectedDatasetOption);
        runSuccess.push('Fairness');
      } catch (error) {
        runErrors.push(`Fairness: ${resolveErrorMessage(error)}`);
        setTenetStatus('Fairness', 'error', resolveErrorMessage(error));
      }
    }

    updateDownloadSelection();

    if (runSuccess.length > 0) {
      mvpState.evaluationSuccess = `${runSuccess.join(', ')} evaluation completed.`;
    }
    if (runErrors.length > 0) {
      mvpState.evaluationError = runErrors.join(' | ');
    }
    if (runSuccess.length === 0 && runErrors.length > 0) {
      throw new Error(mvpState.evaluationError || 'No selected tenet completed successfully.');
    }
  } catch (error) {
    mvpState.evaluationError = resolveErrorMessage(error);
  } finally {
    mvpState.currentStepMessage = '';
    mvpState.evaluationInProgress = false;
  }
}

export async function downloadReport() {
  if (mvpState.evaluationInProgress || mvpState.reportDownloadInProgress) {
    return;
  }

  const tenetToDownload = mvpState.selectedDownloadTenet || availableDownloadTenets.value[0];
  const batchId = tenetToDownload ? mvpState.generatedBatchByTenet[tenetToDownload] : null;
  if (!tenetToDownload || !batchId) {
    mvpState.evaluationError = 'No generated batch found to download report.';
    return;
  }

  try {
    mvpState.reportDownloadInProgress = true;
    mvpState.evaluationError = '';
    mvpState.reportStatus = `Downloading ${tenetToDownload.toLowerCase()} report...`;
    if (tenetToDownload === 'Fairness') {
      await downloadFairnessReport(batchId);
    } else {
      await downloadWorkbenchReport(batchId, tenetToDownload.toLowerCase());
    }
    mvpState.reportStatus = `${tenetToDownload} report downloaded successfully.`;
  } catch (error) {
    mvpState.reportStatus = '';
    mvpState.evaluationError = resolveErrorMessage(error, 'Report download failed.');
  } finally {
    mvpState.reportDownloadInProgress = false;
  }
}

export function getTopExplanations(explanations, limit = 8) {
  if (!Array.isArray(explanations) || explanations.length === 0) {
    return [];
  }
  return [...explanations]
    .filter(item => item?.featureName)
    .sort((left, right) => Math.abs(Number(right?.importanceScore || 0)) - Math.abs(Number(left?.importanceScore || 0)))
    .slice(0, limit);
}

export function getMaxAbsoluteImportance(explanations) {
  if (!Array.isArray(explanations) || explanations.length === 0) {
    return 1;
  }
  const maxValue = explanations.reduce((currentMax, item) => {
    const numericValue = Math.abs(Number(item?.importanceScore || 0));
    return numericValue > currentMax ? numericValue : currentMax;
  }, 0);
  return maxValue > 0 ? maxValue : 1;
}

export function getBarWidth(score, maxAbsoluteScore) {
  if (!maxAbsoluteScore || maxAbsoluteScore <= 0) {
    return 0;
  }
  const scoreRatio = Math.abs(Number(score || 0)) / maxAbsoluteScore;
  return Math.min(100, Math.max(7, scoreRatio * 100));
}

export function formatImportance(score) {
  const numericValue = Number(score);
  return Number.isFinite(numericValue) ? numericValue.toFixed(4) : '-';
}

export function formatFeatureValue(value) {
  if (value === null || value === undefined) {
    return '-';
  }
  const formattedValue = String(value);
  if (!formattedValue.trim()) {
    return '-';
  }
  return formattedValue.length > 40 ? `${formattedValue.slice(0, 37)}...` : formattedValue;
}

export function getDiceFeatureEntries(featureMap) {
  if (!featureMap) {
    return [];
  }
  return Object.entries(featureMap).map(([key, value]) => ({ key, value }));
}
