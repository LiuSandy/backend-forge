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
];

/**
 * 需要重命名的文件（避免发布时被 npm 忽略）
 */
const RENAME_FILES: Record<string, string> = {
  _gitignore: '.gitignore',
};

/**
 * 拷贝模板文件到目标目录
 */
export async function copyTemplate(
  templateDir: string,
  targetDir: string
): Promise<void> {
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
      await copyTemplate(srcPath, destPath);
    } else {
      // 拷贝文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
