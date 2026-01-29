import fs from 'node:fs';
import path from 'node:path';

/**
 * 需要排除的文件和目录
 */
const EXCLUDE_PATTERNS = [
  'node_modules',
  'dist',
  '.git',
  '.idea',
  '.vscode',
  '.husky',
  'pnpm-lock.yaml',
  'cli',
  'docs',
  '.DS_Store',
  'README.md', // 项目级 README，由 PROJECT_README.md 重命名替代
  '.env.example', // 排除示例，已自动生成 .env
];

/**
 * 需要重命名的文件（避免发布时被 npm 忽略）
 */
const RENAME_FILES: Record<string, string> = {
  _gitignore: '.gitignore',
  'PROJECT_README.md': 'README.md',
};

/**
 * 拷贝模板文件到目标目录
 * @param templateDir - 源模板目录
 * @param targetDir - 目标目录
 * @param isRoot - 是否是根目录调用（内部参数）
 * @param rootTemplateDir - 根源目录（用于创建 .env）
 */
export async function copyTemplate(
  templateDir: string,
  targetDir: string,
  isRoot = true,
  rootTemplateDir?: string
): Promise<void> {
  // 记录根源目录（仅在第一次调用时）
  if (isRoot) {
    rootTemplateDir = templateDir;
  }

  const files = fs.readdirSync(templateDir);

  for (const file of files) {
    // 跳过排除的文件/目录
    if (EXCLUDE_PATTERNS.includes(file)) {
      continue;
    }

    const srcPath = path.join(templateDir, file);
    const destPath = path.join(targetDir, RENAME_FILES[file] || file);

    const stat = fs.statSync(srcPath);

    if (stat.isDirectory()) {
      // 递归拷贝目录
      fs.mkdirSync(destPath, { recursive: true });
      await copyTemplate(srcPath, destPath, false, rootTemplateDir);
    } else {
      // 拷贝文件
      fs.copyFileSync(srcPath, destPath);
    }
  }

  // 从源的 .env.example 创建 .env 文件（仅在顶层目录）
  if (isRoot && rootTemplateDir) {
    const srcEnvExamplePath = path.join(rootTemplateDir, '.env.example');
    const envPath = path.join(targetDir, '.env');
    if (fs.existsSync(srcEnvExamplePath) && !fs.existsSync(envPath)) {
      fs.copyFileSync(srcEnvExamplePath, envPath);
    }
  }
}
