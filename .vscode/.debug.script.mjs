import { spawn } from 'child_process'

// bootstrap
spawn(
  // TODO: terminate `npm run dev` when Debug exits.
  process.platform === 'win32' ? 'npm.cmd' : 'npm',
  ['run', 'dev'],
  {
    stdio: 'inherit',
    env: Object.assign(process.env, { VSCODE_DEBUG: 'true' }),
  },
)
