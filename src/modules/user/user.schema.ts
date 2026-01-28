/**
 * User Schema 定义
 * 用于请求参数校验和 Swagger 文档生成
 */

/**
 * 用户对象 Schema
 */
export const userSchema = {
  type: 'object',
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'number' },
  },
  required: ['id', 'name', 'email'],
} as const

/**
 * 创建用户请求 Schema
 */
export const createUserSchema = {
  body: {
    type: 'object',
    properties: {
      name: { type: 'string', minLength: 1, maxLength: 50 },
      email: { type: 'string', format: 'email' },
    },
    required: ['name', 'email'],
  },
  response: {
    201: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: userSchema,
        timestamp: { type: 'number' },
      },
    },
  },
} as const

/**
 * 获取用户列表 Schema
 */
export const getUsersSchema = {
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: {
          type: 'array',
          items: userSchema,
        },
        timestamp: { type: 'number' },
      },
    },
  },
} as const

/**
 * 获取单个用户 Schema
 */
export const getUserSchema = {
  params: {
    type: 'object',
    properties: {
      id: { type: 'string' },
    },
    required: ['id'],
  },
  response: {
    200: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        data: userSchema,
        timestamp: { type: 'number' },
      },
    },
  },
} as const
