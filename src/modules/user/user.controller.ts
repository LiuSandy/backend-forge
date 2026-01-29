import type { FastifyRequest, FastifyReply } from 'fastify'
import { UserService, type CreateUserDto } from './user.service.js'

/**
 * User Controller
 * 控制器层：处理 HTTP 请求和响应
 */
export class UserController {
  private userService: UserService

  constructor() {
    this.userService = new UserService()
  }

  /**
   * 获取用户列表
   */
  async getUsers(_request: FastifyRequest, reply: FastifyReply) {
    const users = await this.userService.getUsers()
    return reply.success(users)
  }

  /**
   * 获取单个用户
   */
  async getUser(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ) {
    const { id } = request.params
    const user = await this.userService.getUserById(id)

    if (!user) {
      return reply.fail('USER_NOT_FOUND', '用户不存在', undefined, 404)
    }

    return reply.success(user)
  }

  /**
   * 创建用户
   */
  async createUser(
    request: FastifyRequest<{ Body: CreateUserDto }>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.userService.createUser(request.body)
      return reply.code(200).success(user, '用户创建成功')
    } catch (error) {
      if (error instanceof Error) {
        return reply.fail('CREATE_USER_FAILED', error.message)
      }
      throw error
    }
  }
}
