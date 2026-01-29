#!/usr/bin/env node

import { create } from './create.js';
import pc from 'picocolors';
import { getVersion } from './utils/version.js';

const args = process.argv.slice(2);

// 显示版本信息
function showVersion() {
  const version = getVersion();
  console.log(pc.cyan(`v${version}`));
}

// 显示帮助信息
function showHelp() {
  console.log(`
${pc.cyan('Backend Forge CLI')} - 快速创建 Fastify + TypeScript 后端项目

${pc.bold('用法:')}
  forge create [project-name]    创建新项目
  forge -v, --version            显示版本号
  forge -h, --help               显示帮助信息

${pc.bold('示例:')}
  ${pc.dim('# 交互式创建项目')}
  forge create

  ${pc.dim('# 直接指定项目名')}
  forge create my-app

  ${pc.dim('# 查看版本')}
  forge -v

${pc.bold('更多信息:')}
  npm 主页: https://www.npmjs.com/package/backend-forge-cli
  `);
}

async function main() {
  const command = args[0];

  // 处理版本选项
  if (command === '-v' || command === '--version') {
    showVersion();
    return;
  }

  // 处理帮助选项
  if (command === '-h' || command === '--help' || !command) {
    showHelp();
    return;
  }

  // 处理创建命令
  if (command === 'create') {
    const projectName = args[1];
    await create(projectName);
  } else {
    console.log(pc.red(`未知命令: ${command}`));
    console.log(pc.dim('\n运行 forge -h 查看帮助信息'));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(pc.red('创建项目时发生错误:'), error);
  process.exit(1);
});
