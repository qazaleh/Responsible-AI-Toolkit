function readMfeConfig() {
  return (typeof window !== 'undefined' && window.__RAI_MFE_CONFIG__) || {};
}

const config = readMfeConfig();

export const runtimeState = {
  homeFilePathUrl: config.homeFilePathUrl || 'http://localhost:30056',
  dicomFilePathUrl: config.dicomFilePathUrl || 'http://localhost:30056',
  masterUrl: config.masterUrl || 'http://localhost:30016/api/v1/rai/admin/ConfigApi',
  diceServiceUrl: config.diceServiceUrl || 'http://localhost:8004',
  enableInternetSearch: config.enableInternetSearch !== 'false',
  enableInterpret: config.enableInterpret !== 'false',
  authorityApi: config.authorityApi || 'http://localhost:30019/v1/rai/backend/pageauthoritynew',
  websocketUrl: config.websocketUrl || 'ws://localhost:5001',
  shellUrl: config.shellUrl || 'http://localhost:30011',
  backendUrl: config.backendUrl || 'http://localhost:30019/v1/rai/backend',
  adminUrl: config.adminUrl || 'http://localhost:30016',
  frontendUrl: config.frontendUrl || 'http://localhost:30056'
};

export function resolveOrigin(url) {
  try {
    return new URL(url).origin;
  } catch (error) {
    return '*';
  }
}
