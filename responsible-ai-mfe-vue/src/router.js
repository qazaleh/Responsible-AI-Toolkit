import { createRouter, createWebHashHistory } from 'vue-router';

import LayoutView from './views/LayoutView.vue';
import LoginView from './views/LoginView.vue';
import ProductSuiteView from './views/ProductSuiteView.vue';
import { authState, embeddedModeAllowed } from './lib/auth';
import { canAccessSection, defaultSectionPath, sectionCatalog } from './lib/navigation';

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
        { path: 'trustai-x', component: ProductSuiteView },
        { path: 'trustai-ux', component: ProductSuiteView },
        { path: 'reports', component: ProductSuiteView },
        { path: 'workbench', component: ProductSuiteView },
        { path: 'usecase', alias: 'use-cases', component: ProductSuiteView },
        { path: 'models', alias: 'ai-models', component: ProductSuiteView },
        { path: 'benchmarking', alias: 'llm-benchmarking', component: ProductSuiteView },
        { path: 'configs', alias: 'admin-configuration', component: ProductSuiteView },
        { path: 'user-management', component: ProductSuiteView },
        { path: 'ai-content-detector', component: ProductSuiteView },
        { path: 'document-management', component: ProductSuiteView },
        { path: 'red-teaming', component: ProductSuiteView },
        { path: 'compliance-check', component: ProductSuiteView },
        { path: 'bulk-processing', component: ProductSuiteView }
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
