const { execFileSync } = require('child_process');

try {
  const out = execFileSync('powershell.exe', [
    '-NoProfile',
    '-Command',
    'Get-CimInstance Win32_Process | Where-Object { $_.Name -like "*node*" } | Select-Object ProcessId, CommandLine | ConvertTo-Json'
  ]).toString();
  const procs = JSON.parse(out);
  procs.forEach(p => console.log('PID:', p.ProcessId, '-->', p.CommandLine));
} catch (e) {
  console.error(e.message);
}
