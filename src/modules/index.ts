import type { FastifyPluginAsync } from 'fastify'
import { userRoutes } from './user/index.js'

/**
 * 业务模块聚合与注册
 * 自动注册所有业务模块的路由
 */
const registerModules: FastifyPluginAsync = async (fastify) => {
  // 注册用户模块
  await fastify.register(userRoutes)

  // 未来可以在此继续注册其他模块
  // await fastify.register(orderRoutes)
  // await fastify.register(productRoutes)
}

export default registerModules
