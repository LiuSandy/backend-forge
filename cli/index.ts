#!/usr/bin/env node

import { create } from './create.js';
import pc from 'picocolors';

const args = process.argv.slice(2);

async function main() {
  const command = args[0];

  if (command === 'create') {
    const projectName = args[1];
    await create(projectName);
  } else {
    console.log(pc.red('未知命令，请使用: forge create <project-name>'));
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(pc.red('创建项目时发生错误:'), error);
  process.exit(1);
});
