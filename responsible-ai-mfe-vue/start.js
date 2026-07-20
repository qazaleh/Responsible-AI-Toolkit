import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || '30056';
const config = {
  homeFilePathUrl: process.env.HOMEFILEPATHURL || `http://localhost:${port}`,
  dicomFilePathUrl: process.env.DICOMFILEPATHURL || `http://localhost:${port}`,
  masterUrl:
    process.env.MASTERURL || 'http://localhost:30016/api/v1/rai/admin/ConfigApi',
  diceServiceUrl: process.env.DICE_SERVICE_URL || 'http://localhost:8004',
  enableInternetSearch: process.env.ENABLESEARCH || 'true',
  enableInterpret: process.env.ENABLEINTERPRET || 'true',
  authorityApi:
    process.env.AUTHORITY_API || 'http://localhost:30019/v1/rai/backend/pageauthoritynew',
  websocketUrl: process.env.WEBSOCKET_URL || 'ws://localhost:5001',
  authToken: process.env.AUTH_TOKEN || 'Bearer None',
  shellUrl: process.env.SHELL_URL || 'http://localhost:30011',
  backendUrl: process.env.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend',
  adminUrl: process.env.ADMIN_URL || 'http://localhost:30016',
  frontendUrl: process.env.FRONTEND_URL || `http://localhost:${port}`
};

writeFileSync(
  path.join(__dirname, 'public/runtime-config.js'),
  `window.__RAI_MFE_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`,
  'utf8'
);

const viteCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const child = spawn(viteCommand, ['vite', '--host', '0.0.0.0', '--port', port], {
  cwd: __dirname,
  stdio: 'inherit'
});

child.on('exit', code => {
  process.exit(code ?? 0);
});
