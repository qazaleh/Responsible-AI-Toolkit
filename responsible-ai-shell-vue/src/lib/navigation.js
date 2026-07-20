export const ROUTE_CATALOG = [
  {
    pageKey: 'Workbench',
    path: '/responsible-ui/workbench',
    label: 'Workbench',
    summary: 'Run guardrail checks against prompts, documents, and models.',
    group: 'primary'
  },
  {
    pageKey: 'Usecase',
    path: '/responsible-ui/usecase',
    label: 'Use Cases',
    summary: 'Register and track responsible AI use cases.',
    group: 'primary'
  },
  {
    pageKey: 'Models',
    path: '/responsible-ui/models',
    label: 'Models',
    summary: 'Review registered model metadata and footprint.',
    group: 'primary'
  },
  {
    pageKey: 'LLM-Benchmarking',
    path: '/responsible-ui/benchmarking',
    label: 'LLM Benchmarking',
    summary: 'Compare model performance across benchmark suites.',
    group: 'primary'
  },
  {
    pageKey: 'AI-Content-Detector',
    path: '/responsible-ui/ai-content-detector',
    label: 'AI Content Detector',
    summary: 'Detect AI-generated or manipulated content.',
    group: 'primary'
  },
  {
    pageKey: 'Document',
    path: '/responsible-ui/document-management',
    label: 'Document Management',
    summary: 'Manage uploaded documents used for evaluation.',
    group: 'secondary'
  },
  {
    pageKey: 'RedTeaming',
    path: '/responsible-ui/red-teaming',
    label: 'Red Teaming',
    summary: 'Stress test models against adversarial prompts.',
    group: 'secondary'
  },
  {
    pageKey: 'ComplianceCheck',
    path: '/responsible-ui/compliance-check',
    label: 'Compliance Check',
    summary: 'Verify use cases against regulatory requirements.',
    group: 'secondary'
  },
  {
    pageKey: 'Admin Configuration',
    path: '/responsible-ui/configs',
    label: 'Admin Configuration',
    summary: 'Configure global moderation and safety settings.',
    group: 'admin',
    authority: 'ROLE_ADMIN'
  },
  {
    pageKey: 'User Management',
    path: '/responsible-ui/user-management',
    label: 'User Management',
    summary: 'Manage user activation status and authorities.',
    group: 'admin',
    authority: 'ROLE_ADMIN'
  }
];

export function resolveAccessibleRoutes(pages, authorities = []) {
  const grantedPages = pages && typeof pages === 'object' ? Object.keys(pages) : [];

  return ROUTE_CATALOG.filter(route => {
    if (!grantedPages.includes(route.pageKey)) {
      return false;
    }

    if (route.authority && !authorities.includes(route.authority)) {
      return false;
    }

    return true;
  });
}

export function defaultWorkspacePath(pages, authorities = []) {
  const [first] = resolveAccessibleRoutes(pages, authorities);
  return first ? first.path : '/responsible-ui/workbench';
}
