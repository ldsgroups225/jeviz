#!/usr/bin/env node

/**
 * Auto Lint & Fix Hook
 *
 * Runs ESLint with auto-fix on modified JavaScript/TypeScript files
 * Triggered after Write/Edit operations to maintain code quality
 */

import { execSync } from 'child_process';
import { readFileSync } from 'fs';

// Read JSON input from stdin
const input = JSON.parse(readFileSync(0, 'utf8'));

// Filter for relevant file types and modified files
const relevantExtensions = ['.js', '.ts', '.jsx', '.tsx'];
const modifiedFiles = input.context?.files?.filter(file =>
  relevantExtensions.some(ext => file.path.endsWith(ext))
) || [];

if (modifiedFiles.length === 0) {
  // No relevant files changed, exit silently
  console.log(JSON.stringify({
    continue: true,
    suppressOutput: true
  }));
  process.exit(0);
}

try {
  // Extract file paths for ESLint
  const filePaths = modifiedFiles.map(f => f.path);

  // Run ESLint with auto-fix
  const result = execSync(
    `npx eslint "${filePaths.join('" "')}" --fix`,
    {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.env.CLAUDE_PROJECT_DIR || process.cwd()
    }
  );

  // Check if any files were actually fixed
  const fixedCount = result.split('\n').filter(line =>
    line.includes('fixed') || line.includes('replaced')
  ).length;

  if (fixedCount > 0) {
    console.log(JSON.stringify({
      continue: true,
      suppressOutput: false,
      additionalContext: `✅ ESLint auto-fixed ${fixedCount} issue(s) in ${filePaths.length} file(s):\n${filePaths.map(f => `• ${f}`).join('\n')}`
    }));
  } else {
    // No fixes needed, keep silent
    console.log(JSON.stringify({
      continue: true,
      suppressOutput: true
    }));
  }

} catch (error) {
  // ESLint found unfixable errors or failed
  const errorMessage = error.stdout || error.message || 'Unknown ESLint error';

  console.log(JSON.stringify({
    continue: true,
    suppressOutput: false,
    additionalContext: `⚠️ ESLint found issues that couldn't be auto-fixed:\n${errorMessage}\n\nFiles affected:\n${modifiedFiles.map(f => `• ${f.path}`).join('\n')}`
  }));
}