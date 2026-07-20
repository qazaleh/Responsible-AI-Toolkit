import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || '30011';
const config = {
  serverApiUrl: process.env.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend',
  frontendUrl: process.env.FRONTEND_URL || `http://localhost:${port}`,
  adminUrl: process.env.ADMIN_URL || 'http://localhost:30016',
  masterUrl:
    process.env.MASTER_URL || 'http://localhost:30016/api/v1/rai/admin/ConfigApi',
  mfeUrl: process.env.MFE_URL || 'http://localhost:30056',
  defaultUsername: process.env.LOGIN_USER_NAME || 'admin',
  defaultPassword: process.env.LOGIN_USER_CRED || 'admin',
  telemetryDashboard: process.env.TELEMETRY_DASHBOARD || '',
  ssoBasedLogin: process.env.SSO_BASED_LOGIN === 'true'
};

writeFileSync(
  path.join(__dirname, 'public/runtime-config.js'),
  `window.__RAI_SHELL_CONFIG__ = ${JSON.stringify(config, null, 2)};\n`,
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
