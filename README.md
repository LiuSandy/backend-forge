# backend-forge-cli

> 快速创建基于 Fastify + TypeScript 的生产级后端项目

[![npm version](https://img.shields.io/npm/v/backend-forge-cli.svg)](https://www.npmjs.com/package/backend-forge-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen.svg)](https://nodejs.org/)

## 简介

`backend-forge-cli` 是一个命令行工具，用于快速创建基于 **Fastify + TypeScript** 的后端项目脚手架。

通过一条命令，您可以获得一个开箱即用、遵循最佳实践的后端项目模板，包含：

- ✅ 环境变量校验（Fail Fast）
- ✅ 统一响应格式
- ✅ 全局错误处理
- ✅ Swagger/OpenAPI 文档
- ✅ 模块化架构
- ✅ 测试框架集成

## 安装

### 全局安装（推荐）

```bash
pnpm add -g backend-forge-cli
```

或使用其他包管理器：

```bash
npm install -g backend-forge-cli
# 或
yarn global add backend-forge-cli
```

### 本地使用（无需安装）

使用 `pnpm dlx` 直接运行（推荐方式）：

```bash
pnpm dlx backend-forge-cli create my-app
```

或使用 `npx`：

```bash
npx backend-forge-cli create my-app
```

## 使用方法

### 创建新项目

```bash
# 全局安装后使用
forge create <project-name>

# 或使用 pnpm dlx（无需安装）
pnpm dlx backend-forge-cli create <project-name>
```

### 交互式创建

如果不指定项目名，CLI 会引导您完成项目配置：

```bash
forge create
```

您需要提供：
- 项目名称
- 项目描述
- 作者信息

### 快速开始

创建项目后，按照提示操作：

```bash
cd <project-name>
pnpm install
cp .env.example .env
pnpm dev
```

项目启动后，访问：
- **API 服务**: http://localhost:3000/api
- **健康检查**: http://localhost:3000/health
- **Swagger 文档**: http://localhost:3000/docs

## 生成的项目特性

使用 `backend-forge-cli` 创建的项目包含以下特性：

### 🚀 核心能力

- **高性能 Web 框架**: 基于 Fastify 4.x
- **TypeScript**: 完整的类型支持和严格检查
- **环境变量校验**: 使用 Zod 在启动时校验配置
- **统一响应格式**: 标准化的 API 响应结构
- **全局错误处理**: 集中式错误捕获和转换
- **自动 API 文档**: 集成 Swagger/OpenAPI

## 技术栈

生成的项目使用以下技术栈：

- **运行时**: Node.js >= 20
- **包管理器**: pnpm >= 8
- **Web 框架**: Fastify 4.x
- **编程语言**: TypeScript 5.x
- **校验库**: Zod
- **测试框架**: Vitest
- **代码规范**: ESLint

## 扩展能力

生成的项目可以轻松集成：

- **数据库**: Prisma / TypeORM / Mongoose
- **认证**: JWT / Passport / Session
- **缓存**: Redis / In-Memory
- **消息队列**: BullMQ / RabbitMQ
- **微服务**: 拆分为独立服务

详细集成指南请查看生成项目中的 `README.md` 文件。

## 常见问题

### Q: 生成的项目可以自由修改吗？

A: 当然！生成的项目完全属于您，可以根据需求自由调整架构、添加功能、修改配置。

### Q: 支持哪些 Node.js 版本？

A: 要求 Node.js >= 20，推荐使用最新 LTS 版本。

### Q: 可以用 npm/yarn 代替 pnpm 吗？

A: 可以，但强烈推荐使用 pnpm。项目在 `package.json` 中指定了 `packageManager` 字段。

### Q: 如何更新脚手架版本？

A:
```bash
# 全局安装方式
pnpm update -g backend-forge-cli

# pnpm dlx 方式会自动使用最新版本
pnpm dlx backend-forge-cli@latest create my-app
```

## 贡献

欢迎贡献！请查看项目的 GitHub 仓库了解贡献指南。

## 许可证

[MIT License](LICENSE)

## 相关链接

- [Fastify 官方文档](https://fastify.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/)
- [Zod 文档](https://zod.dev/)
- [Vitest 文档](https://vitest.dev/)

---

**Happy Forging! 🔨**
