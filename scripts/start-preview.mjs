import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, openSync, closeSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const url = 'http://127.0.0.1:5173/';
const vite = resolve(root, 'node_modules/vite/bin/vite.js');
const logPath = resolve(root, 'tmp/preview-service.log');

async function ready() {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1500) });
    return response.ok && (await response.text()).includes('/src/main.jsx');
  } catch { return false; }
}

if (!existsSync(vite)) {
  console.error('Project dependencies are missing. Run pnpm install in this folder first.');
  process.exit(1);
}

if (await ready()) {
  console.log(`Portfolio is already running: ${url}`);
  process.exit(0);
}

mkdirSync(resolve(root, 'tmp'), { recursive: true });
const log = openSync(logPath, 'a');
const child = spawn(process.execPath, [vite, '--host', '127.0.0.1', '--port', '5173', '--strictPort'], {
  cwd: root,
  detached: true,
  windowsHide: true,
  stdio: ['ignore', log, log],
});
child.on('error', error => {
  console.error(`Could not start preview: ${error.message}`);
  process.exitCode = 1;
});
child.unref();
closeSync(log);

for (let attempt = 0; attempt < 40; attempt++) {
  if (await ready()) {
    console.log(`Portfolio is ready: ${url}`);
    process.exit(0);
  }
  await delay(250);
}

console.error(`Preview did not start. Check ${logPath}`);
process.exit(1);
