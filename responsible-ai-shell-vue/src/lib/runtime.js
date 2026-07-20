function readShellConfig() {
  return (typeof window !== 'undefined' && window.__RAI_SHELL_CONFIG__) || {};
}

const config = readShellConfig();

export const runtimeConfig = {
  serverApiUrl: config.serverApiUrl || 'http://localhost:30019/v1/rai/backend',
  frontendUrl: config.frontendUrl || 'http://localhost:30011',
  adminUrl: config.adminUrl || 'http://localhost:30016',
  masterUrl: config.masterUrl || 'http://localhost:30016/api/v1/rai/admin/ConfigApi',
  mfeUrl: config.mfeUrl || 'http://localhost:30056',
  defaultUsername: config.defaultUsername || 'admin',
  defaultPassword: config.defaultPassword || 'admin',
  telemetryDashboard: config.telemetryDashboard || '',
  ssoBasedLogin: Boolean(config.ssoBasedLogin)
};

export function resolveOrigin(url) {
  try {
    return new URL(url).origin;
  } catch (error) {
    return '*';
  }
}
