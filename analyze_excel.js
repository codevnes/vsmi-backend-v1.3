#!/usr/bin/env node
/**
 * This is a simple wrapper script that calls the Excel inspection tool.
 * Usage: node analyze_excel.js [filePath]
 */

// Forward all arguments to the inspection script
const { spawn } = require('child_process');
const args = process.argv.slice(2);

// Run the inspect-excel.js script
const inspectProcess = spawn('node', ['scripts/inspect-excel.js', ...args], {
  stdio: 'inherit'
});

// Handle exit
inspectProcess.on('close', code => {
  process.exit(code);
}); 