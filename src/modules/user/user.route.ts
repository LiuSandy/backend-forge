import type { FastifyPluginAsync } from 'fastify'
import { UserController } from './user.controller.js'
import {
  createUserSchema,
  getUsersSchema,
  getUserSchema,
} from './user.schema.js'

/**
 * User 模块路由
 */
const userRoutes: FastifyPluginAsync = async (fastify) => {
  const userController = new UserController()

  // GET /users - 获取用户列表
  fastify.get('/users', {
    schema: {
      tags: ['user'],
      description: '获取用户列表',
      ...getUsersSchema,
    },
  }, userController.getUsers.bind(userController))

  // GET /users/:id - 获取单个用户
  fastify.get('/users/:id', {
    schema: {
      tags: ['user'],
      description: '根据 ID 获取用户',
      ...getUserSchema,
    },
  }, userController.getUser.bind(userController))

  // POST /users - 创建用户
  fastify.post('/users', {
    schema: {
      tags: ['user'],
      description: '创建新用户',
      ...createUserSchema,
    },
  }, userController.createUser.bind(userController))
}

export default userRoutes
