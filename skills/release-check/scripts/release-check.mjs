import { execSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import semanticRelease from 'semantic-release';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, '..');

function getArgumentBranch() {
  const [, , ...args] = process.argv;

  const explicitBranch = args.find((arg) => !arg.startsWith('-'));
  if (explicitBranch) {
    return explicitBranch.trim();
  }

  const namedArg = args.find((arg) => arg.startsWith('--branch='));
  if (namedArg) {
    return namedArg.slice('--branch='.length).trim();
  }

  return undefined;
}

function getCurrentBranch() {
  const envBranch =
    process.env.GITHUB_REF_NAME ||
    process.env.CI_COMMIT_REF_NAME ||
    process.env.BRANCH_NAME ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    process.env.GIT_BRANCH;

  if (envBranch) {
    return envBranch.replace(/^refs\/heads\//, '').trim();
  }

  try {
    return execSync('git rev-parse --abbrev-ref HEAD', {
      cwd: repoRoot,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return undefined;
  }
}

function sanitizePrerelease(branchName) {
  return branchName
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 20) || 'dev';
}

function withBranch(baseBranches, branchName) {
  const alreadyConfigured = baseBranches.some((branch) =>
    typeof branch === 'string' ? branch === branchName : branch.name === branchName,
  );

  if (alreadyConfigured) {
    return baseBranches;
  }

  return [
    ...baseBranches,
    {
      name: branchName,
      channel: false,
      prerelease: sanitizePrerelease(branchName),
    },
  ];
}

function withLocalPlugins(basePlugins) {
  const hasGitHubToken = Boolean(process.env.GH_TOKEN || process.env.GITHUB_TOKEN);

  if (hasGitHubToken) {
    return basePlugins;
  }

  return basePlugins.filter((plugin) => {
    if (typeof plugin === 'string') {
      return plugin !== '@semantic-release/github';
    }

    return plugin[0] !== '@semantic-release/github';
  });
}

async function loadConfig() {
  const configPath = path.join(repoRoot, '.releaserc.json');
  const rawConfig = await readFile(configPath, 'utf8');

  return JSON.parse(rawConfig);
}

async function main() {
  const branchName = getArgumentBranch() || getCurrentBranch();

  if (!branchName) {
    console.error('Could not determine a branch name for release validation.');
    process.exitCode = 1;
    return;
  }

  const baseConfig = await loadConfig();
  const config = {
    ...baseConfig,
    branches: withBranch(baseConfig.branches ?? [], branchName),
    plugins: withLocalPlugins(baseConfig.plugins ?? []),
    dryRun: true,
    ci: false,
  };

  console.log(`Running release check for branch: ${branchName}`);

  const result = await semanticRelease(config, {
    cwd: repoRoot,
    env: process.env,
    stdout: process.stdout,
    stderr: process.stderr,
  });

  if (!result) {
    console.log('No release was generated for this branch.');
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});