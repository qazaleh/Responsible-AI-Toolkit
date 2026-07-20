/**
 * TrustAI React Shell runtime environment configuration injector.
 * Gathers system environment variables and writes them to env-config.js
 * to support Twelve-Factor App runtime deployments in Docker.
 *
 * Also patches apps/web/vite.config.ts to inject the MFE remote entry URL
 * at container startup — matching the Angular start.js webpack.config.js rewrite pattern.
 */
const fs = require('fs');
const path = require('path');
const { exec, spawn } = require('child_process');

const envConfigPath = path.join(__dirname, 'apps', 'web', 'public', 'env-config.js');
const viteConfigPath = path.join(__dirname, 'apps', 'web', 'vite.config.ts');

const variables = {
  SERVER_API_URL: process.env.SERVER_API_URL || 'http://localhost:30019/v1/rai/backend',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:30010',
  ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:30016',
  MFE_URL: process.env.MFE_URL || 'http://localhost:30055',
  SSO_BASED_LOGIN: process.env.SSO_BASED_LOGIN || 'false',
};

console.log('TrustAI Shell environment configuration injector active.');
console.log('Gathering variables:');
Object.entries(variables).forEach(([key, val]) => {
  console.log(`  ${key}: ${val}`);
});

// --- Step 1: Write env-config.js for runtime browser access ---
const content = `window._env_ = ${JSON.stringify(variables, null, 2)};\n`;

const publicDir = path.dirname(envConfigPath);
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}
fs.writeFileSync(envConfigPath, content, 'utf8');
console.log(`Successfully written env config to: ${envConfigPath}`);

// --- Step 2: Patch vite.config.ts with the real MFE remote entry URL ---
// This mirrors what Angular start.js did for webpack.config.js (updateWebpackConfig).
// The vite.config.ts keeps a token "MFE_REMOTE_ENTRY_URL" in git.
// We replace the entire rAIFrontend remote value (token or previous URL) idempotently.
const mfeRemoteEntry = `${variables.MFE_URL}/assets/remoteEntry.js`;

if (fs.existsSync(viteConfigPath)) {
  const viteConfigContent = fs.readFileSync(viteConfigPath, 'utf8');
  // Idempotent: replaces either the placeholder token or any previously injected URL
  const patched = viteConfigContent.replace(
    /rAIFrontend:\s*["'][^"']*["']/,
    `rAIFrontend: "${mfeRemoteEntry}"`
  );
  fs.writeFileSync(viteConfigPath, patched, 'utf8');
  console.log(`Patched vite.config.ts → MFE remote entry: ${mfeRemoteEntry}`);
} else {
  console.warn(`vite.config.ts not found at ${viteConfigPath} — skipping MFE URL patch`);
}

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

// --- Step 3: Execute dev server or production server ---
if (process.argv.includes('--run-dev')) {
  console.log('Starting dynamic Vite development environment...');
  runCommand('npm', ['run', 'dev']);
}

if (process.argv.includes('--run-prod')) {
  const clientBuildDir = path.join(__dirname, 'apps', 'web', 'build', 'client');
  // Also write env-config.js into the production build directory
  const prodEnvPath = path.join(clientBuildDir, 'env-config.js');
  if (fs.existsSync(clientBuildDir)) {
    fs.writeFileSync(prodEnvPath, content, 'utf8');
    console.log(`Written production env config to: ${prodEnvPath}`);
  }
  console.log('Starting production static server...');
  runCommand('npx', ['--yes', 'serve', '-s', 'apps/web/build/client', '-l', 'tcp://0.0.0.0:30010', '--cors']);
}
