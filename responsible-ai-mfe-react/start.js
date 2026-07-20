/**
 * TrustAI React MFE runtime environment configuration injector.
 * Gathers system environment variables and writes them to env-config.js
 * to support Twelve-Factor App runtime deployments in Docker.
 */
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const isProd = process.argv.includes('--run-prod');
const envConfigPath = isProd 
  ? path.join(__dirname, 'apps', 'web', 'build', 'client', 'env-config.js')
  : path.join(__dirname, 'apps', 'web', 'public', 'env-config.js');

const masterUrl = process.env.MASTERURL || 'http://localhost:30016/api/v1/rai/admin/ConfigApi';

function getAdminBaseUrl(master) {
  if (process.env.ADMIN_API_URL) {
    return process.env.ADMIN_API_URL;
  }
  try {
    return new URL(master).origin;
  } catch {
    return 'http://localhost:30016';
  }
}

const variables = {
  HOMEFILEPATHURL: process.env.HOMEFILEPATHURL || 'http://localhost:30055',
  DICOMFILEPATHURL: process.env.DICOMFILEPATHURL || 'http://localhost:30055',
  MASTERURL: masterUrl,
  AUTHORITY_API: process.env.AUTHORITY_API || 'http://localhost:30019/v1/rai/backend/pageauthoritynew',
  SERVER_API_URL: process.env.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend',
  ADMIN_API_URL: getAdminBaseUrl(masterUrl),
  MODEL_DETAIL_API_URL: process.env.MODEL_DETAIL_API_URL || 'http://localhost:30020',
  LLM_BENCHMARKING_API_URL: process.env.LLM_BENCHMARKING_API_URL || 'http://localhost:30022',
  USE_CASE_API_URL: process.env.USE_CASE_API_URL || process.env.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend',
  WORKBENCH_API_URL: process.env.WORKBENCH_API_URL || process.env.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend',
};

console.log('TrustAI MFE environment configuration injector active.');
console.log('Gathering variables:');
Object.entries(variables).forEach(([key, val]) => {
  console.log(`  ${key}: ${val}`);
});

const content = `window._env_ = ${JSON.stringify(variables, null, 2)};\n`;

// Ensure public directory exists
const publicDir = path.dirname(envConfigPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(envConfigPath, content, 'utf8');
console.log(`Successfully written configuration to: ${envConfigPath}`);

function runCommand(command, args) {
  const child = spawn(command, args, { stdio: 'inherit' });

  const forwardSignal = signal => {
    if (!child.killed) {
      child.kill(signal);
    }
  };

  process.on('SIGTERM', () => forwardSignal('SIGTERM'));
  process.on('SIGINT', () => forwardSignal('SIGINT'));

  child.on('error', err => {
    console.error(`Failed to start process: ${err.message}`);
    process.exit(1);
  });

  child.on('exit', code => {
    process.exit(code || 0);
  });
}

if (process.argv.includes('--run-dev')) {
  console.log('Starting dynamic Vite development environment...');
  runCommand('npm', ['run', 'dev']);
} else if (process.argv.includes('--run-prod')) {
  const clientBuildDir = path.join(__dirname, 'apps', 'web', 'build', 'client');
  if (!fs.existsSync(clientBuildDir)) {
    console.error(`Build directory not found at ${clientBuildDir}. Ensure the image was built successfully.`);
    process.exit(1);
  }
  console.log('Starting production static server...');
  runCommand('npx', ['--yes', 'serve', '-s', 'apps/web/build/client', '-l', 'tcp://0.0.0.0:30055', '--cors']);
}
