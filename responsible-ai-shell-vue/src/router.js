import { createRouter, createWebHashHistory } from 'vue-router';

import AccountView from './views/AccountView.vue';
import LoginView from './views/LoginView.vue';
import PasswordView from './views/PasswordView.vue';
import RegisterView from './views/RegisterView.vue';
import WorkspaceView from './views/WorkspaceView.vue';
import { authState } from './lib/auth';
import { defaultWorkspacePath } from './lib/navigation';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: () =>
        authState.token
          ? defaultWorkspacePath(authState.pages, authState.account?.authorities || [])
          : '/login'
    },
    {
      path: '/login',
      component: LoginView,
      meta: { public: true }
    },
    {
      path: '/register',
      component: RegisterView,
      meta: { public: true }
    },
    {
      path: '/settings',
      component: AccountView,
      alias: ['/account']
    },
    {
      path: '/password',
      component: PasswordView,
      alias: ['/account/password']
    },
    {
      path: '/responsible-ui/:pathMatch(.*)*',
      component: WorkspaceView
    }
  ]
});

router.beforeEach(async to => {
  if (to.meta.public) {
    if (authState.token && (to.path === '/login' || to.path === '/register')) {
      return defaultWorkspacePath(authState.pages, authState.account?.authorities || []);
    }
    return true;
  }

  if (!authState.token) {
    return '/login';
  }

  if (to.path === '/') {
    return defaultWorkspacePath(authState.pages, authState.account?.authorities || []);
  }

  return true;
});

export default router;
