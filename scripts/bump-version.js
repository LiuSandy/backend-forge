#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const VALID_TYPES = ['major', 'minor', 'patch'];

/**
 * 版本升级脚本
 * 用法: node scripts/bump-version.js [major|minor|patch]
 */

function getCurrentVersion() {
  const versionFile = path.join(rootDir, 'VERSION');
  return fs.readFileSync(versionFile, 'utf-8').trim();
}

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    throw new Error(`Invalid version format: ${version}`);
  }
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    patch: parseInt(match[3], 10),
  };
}

function bumpVersion(currentVersion, type) {
  const version = parseVersion(currentVersion);

  switch (type) {
    case 'major':
      version.major += 1;
      version.minor = 0;
      version.patch = 0;
      break;
    case 'minor':
      version.minor += 1;
      version.patch = 0;
      break;
    case 'patch':
      version.patch += 1;
      break;
    default:
      throw new Error(`Invalid bump type: ${type}`);
  }

  return `${version.major}.${version.minor}.${version.patch}`;
}

function updateVersionFile(newVersion) {
  const versionFile = path.join(rootDir, 'VERSION');
  fs.writeFileSync(versionFile, `${newVersion}\n`, 'utf-8');
  console.log(`✅ Updated VERSION: ${newVersion}`);
}

function updatePackageJson(newVersion) {
  const packageFile = path.join(rootDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageFile, 'utf-8'));
  packageJson.version = newVersion;
  fs.writeFileSync(packageFile, JSON.stringify(packageJson, null, 2) + '\n', 'utf-8');
  console.log(`✅ Updated package.json: ${newVersion}`);
}

function getGitCommits(currentVersion) {
  try {
    // 首先检查是否存在当前版本的 tag
    const lastTag = `v${currentVersion}`;
    let commits = '';

    try {
      // 检查 tag 是否存在
      execSync(`git rev-parse ${lastTag}`, {
        cwd: rootDir,
        stdio: ['pipe', 'pipe', 'ignore']
      });

      // tag 存在，获取从该 tag 到 HEAD 的 commits
      commits = execSync(`git log ${lastTag}..HEAD --pretty=format:"- %s"`, {
        cwd: rootDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'ignore']
      }).trim();
    } catch {
      // tag 不存在，尝试找最新的 tag
      try {
        const latestTag = execSync('git describe --tags --abbrev=0', {
          cwd: rootDir,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'ignore']
        }).trim();

        // 从最新的 tag 到 HEAD 获取 commits
        commits = execSync(`git log ${latestTag}..HEAD --pretty=format:"- %s"`, {
          cwd: rootDir,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'ignore']
        }).trim();
      } catch {
        // 没有任何 tag，只获取 HEAD 的 commit
        commits = execSync('git log -1 --pretty=format:"- %s"', {
          cwd: rootDir,
          encoding: 'utf-8',
          stdio: ['pipe', 'pipe', 'ignore']
        }).trim();
      }
    }

    return commits;
  } catch {
    // 如果不是 git 仓库或没有 commits，返回空字符串
    return '';
  }
}

function formatDate() {
  const now = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];
  const month = months[now.getMonth()];
  const day = now.getDate();
  const year = now.getFullYear();
  return `${month} ${day}, ${year}`;
}

function updateChangelog(newVersion, currentVersion) {
  const changelogFile = path.join(rootDir, 'CHANGELOG.md');
  const changelog = fs.readFileSync(changelogFile, 'utf-8');

  const dateStr = formatDate();
  const commits = getGitCommits(currentVersion);

  // 构建新版本内容
  let newVersionSection = `## v${newVersion}  (${dateStr})`;
  if (commits) {
    newVersionSection += `\n${commits}`;
  }

  // 在文件开头插入新版本（在 # Changelog 之后）
  const lines = changelog.split('\n');
  const newLines = [];
  let inserted = false;

  for (let i = 0; i < lines.length; i++) {
    newLines.push(lines[i]);

    // 在 # Changelog 后插入新版本
    if (!inserted && lines[i].startsWith('# Changelog')) {
      newLines.push('');
      newLines.push(newVersionSection);
      newLines.push('');
      inserted = true;
    }
  }

  const updatedChangelog = newLines.join('\n');
  fs.writeFileSync(changelogFile, updatedChangelog, 'utf-8');
  console.log(`✅ Updated CHANGELOG.md: v${newVersion}`);
}

function main() {
  const args = process.argv.slice(2);
  const bumpType = args[0] || 'patch'; // 默认为 patch

  if (!VALID_TYPES.includes(bumpType)) {
    console.error('❌ 错误: 无效的版本类型，请使用 [major|minor|patch]');
    console.error('\n用法:');
    console.error('  pnpm bump-version         # 默认升级 patch (1.0.0 -> 1.0.1)');
    console.error('  pnpm bump-version patch   # 升级 patch (1.0.0 -> 1.0.1)');
    console.error('  pnpm bump-version minor   # 升级 minor (1.0.0 -> 1.1.0)');
    console.error('  pnpm bump-version major   # 升级 major (1.0.0 -> 2.0.0)');
    process.exit(1);
  }

  try {
    const currentVersion = getCurrentVersion();
    const newVersion = bumpVersion(currentVersion, bumpType);

    console.log(`\n📦 版本升级: ${currentVersion} -> ${newVersion}\n`);

    updateVersionFile(newVersion);
    updatePackageJson(newVersion);
    updateChangelog(newVersion, currentVersion);

    console.log(`\n✨ 版本升级成功! 新版本: ${newVersion}`);
    console.log('\n下一步操作:');
    console.log('  1. 编辑 CHANGELOG.md，填写此版本的变更内容');
    console.log('  2. 提交变更: git add . && git commit -m "chore: bump version to v' + newVersion + '"');
    console.log('  3. 创建标签: git tag v' + newVersion);
    console.log('  4. 推送代码: git push && git push --tags');
    console.log('  5. 发布 npm: pnpm publish\n');
  } catch (error) {
    console.error('❌ 版本升级失败:', error.message);
    process.exit(1);
  }
}

main();
