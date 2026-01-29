import fs from 'node:fs';
import path from 'node:path';

interface ProjectConfig {
  projectName: string;
  description: string;
  author: string;
}

/**
 * 更新目标项目的 package.json
 */
export async function updatePackageJson(
  targetDir: string,
  config: ProjectConfig
): Promise<void> {
  const packageJsonPath = path.join(targetDir, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

  // 更新基本信息
  packageJson.name = config.projectName;
  packageJson.version = '0.1.0';
  packageJson.description = config.description;
  packageJson.author = config.author;

  // 移除 CLI 相关配置
  delete packageJson.bin;

  // 移除 CLI 相关的依赖
  if (packageJson.dependencies) {
    delete packageJson.dependencies.prompts;
    delete packageJson.dependencies.picocolors;
    delete packageJson.dependencies.execa;
  }

  if (packageJson.devDependencies) {
    delete packageJson.devDependencies['@types/prompts'];
  }

  // 写入更新后的 package.json
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  );
}
