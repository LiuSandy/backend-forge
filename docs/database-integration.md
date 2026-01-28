# 数据库集成指南

本文档详细说明如何在 backend-forge 项目中集成各种数据库。

## 📌 重要说明

本脚手架**未预装任何数据库**，当前使用内存数组作为数据存储（仅用于演示）。

生产环境请根据实际需求选择合适的数据库方案。

---

## 🗄️ 推荐方案

### 方案 1: Prisma（推荐）⭐

**优势**：
- ✅ 类型安全的查询构建器
- ✅ 自动生成 TypeScript 类型
- ✅ 强大的迁移工具
- ✅ 支持多种数据库（PostgreSQL, MySQL, SQLite, MongoDB 等）

#### 1. 安装依赖

```bash
pnpm add prisma @prisma/client
pnpm add -D prisma
```

#### 2. 初始化 Prisma

```bash
pnpm prisma init
```

这会创建：
- `prisma/schema.prisma` - 数据库 Schema 定义
- `.env` - 数据库连接配置（已存在则更新）

#### 3. 配置数据库连接

编辑 `.env` 文件：

```bash
# PostgreSQL 示例
DATABASE_URL="postgresql://user:password@localhost:5432/mydb?schema=public"

# MySQL 示例
DATABASE_URL="mysql://user:password@localhost:3306/mydb"

# SQLite 示例（开发环境）
DATABASE_URL="file:./dev.db"
```

#### 4. 定义 Schema

编辑 `prisma/schema.prisma`：

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"  // 或 "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 5. 生成迁移并执行

```bash
# 创建迁移文件
pnpm prisma migrate dev --name init

# 生成 Prisma Client
pnpm prisma generate
```

#### 6. 创建 Prisma 客户端实例

创建 `src/utils/prisma.ts`：

```typescript
import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

// 优雅关闭
process.on('beforeExit', async () => {
  await prisma.$disconnect()
})
```

#### 7. 修改 Service 层

编辑 `src/modules/user/user.service.ts`：

```typescript
import { prisma } from '@/utils/prisma'
import type { User } from '@prisma/client'

export interface CreateUserDto {
  name: string
  email: string
}

export class UserService {
  async getUsers(): Promise<User[]> {
    return prisma.user.findMany()
  }

  async getUserById(id: string): Promise<User | null> {
    return prisma.user.findUnique({
      where: { id }
    })
  }

  async createUser(dto: CreateUserDto): Promise<User> {
    return prisma.user.create({
      data: dto
    })
  }
}
```

#### 8. 更新环境变量校验

编辑 `src/config/env.ts`，添加数据库 URL 校验：

```typescript
const envSchema = z.object({
  // ... 现有配置
  DATABASE_URL: z.string().url(),
})
```

#### 9. 常用命令

```bash
# 查看数据库状态
pnpm prisma studio

# 创建迁移
pnpm prisma migrate dev

# 重置数据库
pnpm prisma migrate reset

# 生成 Prisma Client
pnpm prisma generate
```

---

### 方案 2: TypeORM

**优势**：
- ✅ 成熟的 ORM，社区活跃
- ✅ 支持装饰器语法
- ✅ 强大的查询构建器

#### 1. 安装依赖

```bash
# PostgreSQL
pnpm add typeorm pg reflect-metadata

# MySQL
pnpm add typeorm mysql2 reflect-metadata

# SQLite
pnpm add typeorm sqlite3 reflect-metadata
```

#### 2. 创建数据源配置

创建 `src/config/database.ts`：

```typescript
import { DataSource } from 'typeorm'
import { config } from './index.js'

export const AppDataSource = new DataSource({
  type: 'postgres',  // 或 'mysql', 'sqlite'
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: config.NODE_ENV === 'development',
  logging: config.NODE_ENV === 'development',
  entities: ['src/modules/**/*.entity.ts'],
  migrations: ['src/migrations/**/*.ts'],
})

// 初始化连接
export async function initDatabase() {
  await AppDataSource.initialize()
  console.log('✅ Database connected')
}
```

#### 3. 创建实体

创建 `src/modules/user/user.entity.ts`：

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm'

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column({ unique: true })
  email!: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date
}
```

#### 4. 修改 Service 层

```typescript
import { AppDataSource } from '@/config/database'
import { User } from './user.entity'

export class UserService {
  private userRepo = AppDataSource.getRepository(User)

  async getUsers() {
    return this.userRepo.find()
  }

  async getUserById(id: string) {
    return this.userRepo.findOne({ where: { id } })
  }

  async createUser(dto: CreateUserDto) {
    const user = this.userRepo.create(dto)
    return this.userRepo.save(user)
  }
}
```

#### 5. 在 server.ts 中初始化数据库

```typescript
import { initDatabase } from './config/database'

async function start() {
  // 初始化数据库
  await initDatabase()

  // 创建 Fastify 应用
  app = await createApp()

  // ...
}
```

---

### 方案 3: Mongoose (MongoDB)

**优势**：
- ✅ MongoDB 官方推荐
- ✅ Schema 验证强大
- ✅ 插件生态丰富

#### 1. 安装依赖

```bash
pnpm add mongoose
```

#### 2. 创建数据库连接

创建 `src/config/database.ts`：

```typescript
import mongoose from 'mongoose'

export async function connectDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mydb')
    console.log('✅ MongoDB connected')
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error)
    process.exit(1)
  }
}
```

#### 3. 创建 Model

创建 `src/modules/user/user.model.ts`：

```typescript
import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  createdAt: Date
  updatedAt: Date
}

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
}, {
  timestamps: true
})

export const UserModel = mongoose.model<IUser>('User', userSchema)
```

#### 4. 修改 Service 层

```typescript
import { UserModel, type IUser } from './user.model'

export class UserService {
  async getUsers(): Promise<IUser[]> {
    return UserModel.find()
  }

  async getUserById(id: string): Promise<IUser | null> {
    return UserModel.findById(id)
  }

  async createUser(dto: CreateUserDto): Promise<IUser> {
    return UserModel.create(dto)
  }
}
```

#### 5. 在 server.ts 中连接数据库

```typescript
import { connectDatabase } from './config/database'

async function start() {
  // 连接数据库
  await connectDatabase()

  // 创建 Fastify 应用
  app = await createApp()

  // ...
}
```

---

## 🏗️ Repository 模式（进阶）

如果您希望更好地分离数据访问层，可以引入 Repository 模式。

### 创建 Repository 层

创建 `src/modules/user/user.repository.ts`：

```typescript
import { prisma } from '@/utils/prisma'
import type { User, Prisma } from '@prisma/client'

export class UserRepository {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany()
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  async findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  async create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return prisma.user.update({ where: { id }, data })
  }

  async delete(id: string): Promise<User> {
    return prisma.user.delete({ where: { id } })
  }
}
```

### 在 Service 中使用 Repository

```typescript
export class UserService {
  private userRepo = new UserRepository()

  async getUsers() {
    return this.userRepo.findAll()
  }

  async getUserById(id: string) {
    return this.userRepo.findById(id)
  }

  async createUser(dto: CreateUserDto) {
    // 业务逻辑：检查邮箱是否存在
    const exists = await this.userRepo.findByEmail(dto.email)
    if (exists) {
      throw new Error('邮箱已被使用')
    }

    return this.userRepo.create(dto)
  }
}
```

---

## 🔧 迁移和种子数据

### Prisma 种子数据

创建 `prisma/seed.ts`：

```typescript
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'alice@example.com' },
      { name: 'Bob', email: 'bob@example.com' },
    ],
  })
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```

在 `package.json` 中添加：

```json
{
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```

运行：

```bash
pnpm prisma db seed
```

---

## 📚 推荐资源

- [Prisma 官方文档](https://www.prisma.io/docs)
- [TypeORM 官方文档](https://typeorm.io/)
- [Mongoose 官方文档](https://mongoosejs.com/)

---

## 🤝 需要帮助？

如果您在集成数据库时遇到问题，欢迎提交 Issue。
