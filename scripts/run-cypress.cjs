delete process.env.ELECTRON_RUN_AS_NODE;
process.env.ELECTRON_DISABLE_GPU = '1';
const { spawn } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const isWin = process.platform === 'win32';
const cypressBin = path.resolve(__dirname, '..', 'node_modules', '.bin', isWin ? 'cypress.cmd' : 'cypress');

const child = spawn(cypressBin, args, {
  stdio: 'inherit',
  env: process.env,
  shell: isWin
});

child.on('exit', (code) => {
  process.exit(code || 0);
});
