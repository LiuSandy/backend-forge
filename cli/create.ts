import prompts from 'prompts';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import pc from 'picocolors';
import { copyTemplate } from './utils/copy.js';
import { updatePackageJson } from './utils/package.js';
import { getVersion } from './utils/version.js';

// ESM 模块中获取 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface ProjectConfig {
  projectName: string;
  description: string;
  author: string;
}

export async function create(projectName?: string): Promise<void> {
  const version = getVersion();

  // 显示炫酷的欢迎信息
  console.log(pc.cyan(`
╔══════════════════════════════════════════════════════╗
║                                                      ║
║                 BACKEND FORGE                        ║
║                                                      ║
║          Fastify + TypeScript Scaffold               ║
║                     v${version.padEnd(28)}║
║                                                      ║
╚══════════════════════════════════════════════════════╝
`));

  // 收集项目信息
  const config = await collectProjectInfo(projectName);

  const targetDir = path.resolve(process.cwd(), config.projectName);

  // 检查目录是否已存在
  if (fs.existsSync(targetDir)) {
    const { overwrite } = await prompts({
      type: 'confirm',
      name: 'overwrite',
      message: `目录 ${pc.yellow(config.projectName)} 已存在，是否覆盖？`,
      initial: false,
    });

    if (!overwrite) {
      console.log(pc.yellow('\n✋ 已取消创建'));
      return;
    }

    // 删除已存在的目录
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  console.log(pc.green(`\n📦 正在创建项目: ${config.projectName}...\n`));

  // 创建目标目录
  fs.mkdirSync(targetDir, { recursive: true });

  // 拷贝模板文件
  const templateDir = path.resolve(__dirname, '../..');
  await copyTemplate(templateDir, targetDir);

  // 更新 package.json
  await updatePackageJson(targetDir, config);

  // 显示成功信息
  displaySuccessMessage(config.projectName);
}

async function collectProjectInfo(initialName?: string): Promise<ProjectConfig> {
  const response = await prompts(
    [
      {
        type: initialName ? null : 'text',
        name: 'projectName',
        message: '请输入项目名称:',
        initial: 'my-backend-app',
        validate: (value) =>
          value.length > 0 ? true : '项目名称不能为空',
      },
      {
        type: 'text',
        name: 'description',
        message: '请输入项目描述:',
        initial: '基于 Fastify + TypeScript 的后端项目',
      },
      {
        type: 'text',
        name: 'author',
        message: '请输入作者信息:',
        initial: '',
      },
    ],
    {
      onCancel: () => {
        console.log(pc.red('\n✋ 已取消创建'));
        process.exit(0);
      },
    }
  );

  return {
    projectName: initialName || response.projectName,
    description: response.description || '基于 Fastify + TypeScript 的后端项目',
    author: response.author || '',
  };
}

function displaySuccessMessage(projectName: string): void {
  console.log(pc.green('\n✨ 项目创建成功!\n'));
  console.log(pc.cyan('下一步操作:\n'));
  console.log(`  cd ${projectName}`);
  console.log(`  pnpm install`);
  console.log(`  cp .env.example .env`);
  console.log(`  pnpm dev\n`);
  console.log(pc.cyan('可用命令:\n'));
  console.log(`  ${pc.bold('pnpm dev')}          - 启动开发服务器`);
  console.log(`  ${pc.bold('pnpm build')}        - 构建生产版本`);
  console.log(`  ${pc.bold('pnpm start')}        - 运行生产版本`);
  console.log(`  ${pc.bold('pnpm test')}         - 运行测试`);
  console.log(`  ${pc.bold('pnpm lint')}         - 代码检查\n`);
  console.log(pc.gray('Happy coding! 🎉\n'));
}