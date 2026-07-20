export const sectionCatalog = [
  {
    path: '/workbench',
    pageKey: 'Workbench',
    label: 'Workbench',
    tabLabel: 'Workbench',
    eyebrow: 'Guardrails',
    description: 'Run guardrail checks against prompts, documents, and models.',
    keywords: ['moderation', 'workbench'],
    core: true,
    group: 'primary'
  },
  {
    path: '/usecase',
    pageKey: 'Usecase',
    label: 'Use Cases',
    tabLabel: 'Use Cases',
    eyebrow: 'Governance',
    description: 'Register and track responsible AI use cases.',
    keywords: ['questionnaire', 'usecase'],
    core: true,
    group: 'primary'
  },
  {
    path: '/models',
    pageKey: 'Models',
    label: 'Models',
    tabLabel: 'Models',
    eyebrow: 'Inventory',
    description: 'Review registered model metadata and footprint.',
    keywords: ['workbench', 'model'],
    core: true,
    group: 'primary'
  },
  {
    path: '/benchmarking',
    pageKey: 'LLM-Benchmarking',
    label: 'LLM Benchmarking',
    tabLabel: 'Benchmarking',
    eyebrow: 'Evaluation',
    description: 'Compare model performance across benchmark suites.',
    keywords: ['benchmark'],
    core: true,
    group: 'primary'
  },
  {
    path: '/ai-content-detector',
    pageKey: 'AI-Content-Detector',
    label: 'AI Content Detector',
    tabLabel: 'Content Detector',
    eyebrow: 'Detection',
    description: 'Detect AI-generated or manipulated content.',
    keywords: ['content', 'detector'],
    core: false,
    group: 'secondary'
  },
  {
    path: '/document-management',
    pageKey: 'Document',
    label: 'Document Management',
    eyebrow: 'Documents',
    description: 'Manage uploaded documents used for evaluation.',
    keywords: ['document'],
    core: false,
    group: 'secondary'
  },
  {
    path: '/red-teaming',
    pageKey: 'RedTeaming',
    label: 'Red Teaming',
    eyebrow: 'Adversarial Testing',
    description: 'Stress test models against adversarial prompts.',
    keywords: ['redteam', 'adversarial'],
    core: false,
    group: 'secondary'
  },
  {
    path: '/compliance-check',
    pageKey: 'ComplianceCheck',
    label: 'Compliance Check',
    eyebrow: 'Compliance',
    description: 'Verify use cases against regulatory requirements.',
    keywords: ['compliance'],
    core: false,
    group: 'secondary'
  },
  {
    path: '/bulk-processing',
    pageKey: 'BulkProcessing',
    label: 'Bulk Processing',
    eyebrow: 'Automation',
    description: 'Run guardrail checks across batched datasets.',
    keywords: ['bulk'],
    core: false,
    group: 'secondary'
  },
  {
    path: '/configs',
    pageKey: 'Admin Configuration',
    label: 'Admin Configuration',
    eyebrow: 'Administration',
    description: 'Configure global moderation and safety settings.',
    keywords: ['config'],
    core: false,
    group: 'admin',
    authority: 'ROLE_ADMIN'
  },
  {
    path: '/user-management',
    pageKey: 'User Management',
    label: 'User Management',
    eyebrow: 'Administration',
    description: 'Manage user activation status and authorities.',
    keywords: ['user', 'authority'],
    core: false,
    group: 'admin',
    authority: 'ROLE_ADMIN'
  }
];

export function canAccessSection(section, pages, authorities = []) {
  const grantedPages = pages && typeof pages === 'object' ? Object.keys(pages) : [];

  if (!grantedPages.includes(section.pageKey)) {
    return false;
  }

  if (section.authority && !authorities.includes(section.authority)) {
    return false;
  }

  return true;
}

export function resolveAccessibleSections(pages, authorities = []) {
  return sectionCatalog.filter(section => canAccessSection(section, pages, authorities));
}

export function defaultSectionPath(pages, authorities = []) {
  const [first] = resolveAccessibleSections(pages, authorities);
  return first ? first.path : '/workbench';
}
