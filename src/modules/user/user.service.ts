/**
 * User Service
 * 业务逻辑层：处理用户相关的业务逻辑
 *
 * ⚠️ 数据库集成说明
 * 当前使用内存数组作为数据存储（仅用于演示）
 * 生产环境请替换为真实数据库，推荐以下方案：
 *
 * 方案 1: Prisma (推荐)
 * @example
 * import { PrismaClient } from '@prisma/client'
 *
 * export class UserService {
 *   constructor(private prisma: PrismaClient) {}
 *
 *   async getUsers() {
 *     return this.prisma.user.findMany()
 *   }
 *
 *   async getUserById(id: string) {
 *     return this.prisma.user.findUnique({ where: { id } })
 *   }
 *
 *   async createUser(dto: CreateUserDto) {
 *     return this.prisma.user.create({ data: dto })
 *   }
 * }
 *
 * 方案 2: TypeORM
 * @example
 * import { Repository } from 'typeorm'
 * import { User } from './user.entity'
 *
 * export class UserService {
 *   constructor(private userRepo: Repository<User>) {}
 *
 *   async getUsers() {
 *     return this.userRepo.find()
 *   }
 *
 *   async getUserById(id: string) {
 *     return this.userRepo.findOne({ where: { id } })
 *   }
 *
 *   async createUser(dto: CreateUserDto) {
 *     return this.userRepo.save(dto)
 *   }
 * }
 *
 * 方案 3: Mongoose (MongoDB)
 * @example
 * import { UserModel } from './user.model'
 *
 * export class UserService {
 *   async getUsers() {
 *     return UserModel.find()
 *   }
 *
 *   async getUserById(id: string) {
 *     return UserModel.findById(id)
 *   }
 *
 *   async createUser(dto: CreateUserDto) {
 *     return UserModel.create(dto)
 *   }
 * }
 *
 * 详细集成指南请参考：docs/database-integration.md
 */

/**
 * 用户数据接口
 */
export interface User {
  id: string
  name: string
  email: string
  createdAt: number
}

/**
 * 创建用户 DTO
 */
export interface CreateUserDto {
  name: string
  email: string
}

/**
 * 模拟数据库（内存存储 - 仅用于演示）
 * ⚠️ 生产环境请替换为真实数据库
 */
const usersDb: User[] = [
  {
    id: '1',
    name: 'Alice',
    email: 'alice@example.com',
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Bob',
    email: 'bob@example.com',
    createdAt: Date.now(),
  },
]

/**
 * User Service 类
 */
export class UserService {
  /**
   * 获取所有用户
   * TODO: 替换为真实数据库查询
   */
  async getUsers(): Promise<User[]> {
    return usersDb
  }

  /**
   * 根据 ID 获取用户
   * TODO: 替换为真实数据库查询
   */
  async getUserById(id: string): Promise<User | null> {
    const user = usersDb.find((u) => u.id === id)
    return user || null
  }

  /**
   * 创建用户
   * TODO: 替换为真实数据库插入
   */
  async createUser(dto: CreateUserDto): Promise<User> {
    // 检查邮箱是否已存在
    const existingUser = usersDb.find((u) => u.email === dto.email)
    if (existingUser) {
      throw new Error('邮箱已被使用')
    }

    const newUser: User = {
      id: String(usersDb.length + 1),
      name: dto.name,
      email: dto.email,
      createdAt: Date.now(),
    }

    usersDb.push(newUser)
    return newUser
  }
}
