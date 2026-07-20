import { createRouter, createWebHashHistory } from 'vue-router';

import BenchmarkingView from './views/BenchmarkingView.vue';
import ConfigurationView from './views/ConfigurationView.vue';
import LayoutView from './views/LayoutView.vue';
import LoginView from './views/LoginView.vue';
import ModelsView from './views/ModelsView.vue';
import ServiceSectionView from './views/ServiceSectionView.vue';
import UseCasesView from './views/UseCasesView.vue';
import UserManagementView from './views/UserManagementView.vue';
import WorkbenchView from './views/WorkbenchView.vue';
import { authState, embeddedModeAllowed } from './lib/auth';
import { canAccessSection, defaultSectionPath, sectionCatalog, sectionMap } from './lib/navigation';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/login',
      component: LoginView,
      meta: { public: true }
    },
    {
      path: '/',
      component: LayoutView,
      children: [
        {
          path: '',
          redirect: () => defaultSectionPath(authState.pages, authState.account?.authorities || [])
        },
        {
          path: 'workbench',
          component: WorkbenchView,
          meta: sectionMap['/workbench']
        },
        {
          path: 'usecase',
          alias: 'use-cases',
          component: UseCasesView,
          meta: sectionMap['/usecase']
        },
        {
          path: 'models',
          alias: 'ai-models',
          component: ModelsView,
          meta: sectionMap['/models']
        },
        {
          path: 'benchmarking',
          alias: 'llm-benchmarking',
          component: BenchmarkingView,
          meta: sectionMap['/benchmarking']
        },
        {
          path: 'configs',
          alias: 'admin-configuration',
          component: ConfigurationView,
          meta: sectionMap['/configs']
        },
        {
          path: 'user-management',
          component: UserManagementView,
          meta: sectionMap['/user-management']
        },
        {
          path: 'ai-content-detector',
          component: ServiceSectionView,
          meta: sectionMap['/ai-content-detector']
        },
        {
          path: 'document-management',
          component: ServiceSectionView,
          meta: sectionMap['/document-management']
        },
        {
          path: 'red-teaming',
          component: ServiceSectionView,
          meta: sectionMap['/red-teaming']
        },
        {
          path: 'compliance-check',
          component: ServiceSectionView,
          meta: sectionMap['/compliance-check']
        },
        {
          path: 'bulk-processing',
          component: ServiceSectionView,
          meta: sectionMap['/bulk-processing']
        }
      ]
    }
  ]
});

router.beforeEach(to => {
  if (to.meta.public) {
    if (authState.token) {
      return defaultSectionPath(authState.pages, authState.account?.authorities || []);
    }
    return true;
  }

  if (!authState.token && !embeddedModeAllowed(to)) {
    return '/login';
  }

  const matched = sectionCatalog.find(section => section.path === to.path);
  if (matched && authState.token) {
    const allowed = canAccessSection(
      matched,
      authState.pages,
      authState.account?.authorities || []
    );
    if (!allowed) {
      return defaultSectionPath(authState.pages, authState.account?.authorities || []);
    }
  }

  return true;
});

export default router;
