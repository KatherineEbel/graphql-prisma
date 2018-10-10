import bcrypt from 'bcrypt'
import { getUserId, generateToken, hashPassword } from '../utils'

export default {
  async login(parent, { data }, { prisma }) {
    const { email, password } = data
    const user = await prisma.query.user({
      where: { email }
    })
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) throw new Error('Invalid Credentials')
    return {
      user,
      token: generateToken(user.id)
    }
  },
  async createUser(parent, args, { prisma }, info) {
    const { email, password } = args.data
    const hashedPassword = await hashPassword(password)
    const emailTaken = await prisma.exists.User({ email })
    if (emailTaken) throw new Error('Email taken')
    const user = await prisma
      .mutation
      .createUser({
        data: {
          ...args.data,
          password: hashedPassword
        }
      })
    
    return {
      user,
      token: generateToken(user.id)
    }
  },
  deleteUser(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    return prisma.mutation.deleteUser({
      where: { id: userId }
    }, info)
  },
  async updateUser(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)
    if (typeof data.password === 'string') {
      data.password = await hashPassword(data.password)
    }
    return prisma.mutation.updateUser({
      where: { id: userId },
      data
    }, info)
  },
  createPost(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const { title, body, published, author } = data
    return prisma.mutation.createPost({
      data: {
        title,
        body,
        published,
        author: {
          connect: { id: userId }
        }
      }
    }, info)
  },
  async updatePost(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })
    if (!postExists) throw new Error('Unable to update post')
    const { published } = data
    if (!published) {
      await prisma.mutation.deleteManyComments({
        where: {
          post: {
            id
          }
        }
      })
    }
    return prisma.mutation.updatePost({
      where: { id },
      data
    }, info)
  },
  async deletePost(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)
    const postExists = await prisma.exists.Post({
      id,
      author: {
        id: userId
      }
    })
    if (!postExists) throw new Error("Unable to delete post")
    return prisma.mutation.deletePost({
      where: { id }
    }, info)
  },
  async createComment(parent, { data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const { text, post } = data
    const isValid = await prisma.exists.Post({
      id: post,
      published: true
    })
    if (!isValid) throw new Error('Unable to post comment')
    return prisma.mutation.createComment({
      data: {
        text,
        author: {
          connect: { id: userId }
        },
        post: {
          connect: { id: post }
        }
      }
    }, info)
  },
  async updateComment(parent, { id, data }, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })
    
    if (!commentExists) throw new Error('Unable to update comment')
    return prisma.mutation.updateComment({
      data,
      where: { id }
    }, info)
  },
  async deleteComment(parent, { id }, { prisma, request }, info) {
    const userId = getUserId(request)
    const commentExists = await prisma.exists.Comment({
      id,
      author: {
        id: userId
      }
    })
    if (!commentExists) throw new Error('Unable to delete comment')
    return prisma.mutation.deleteComment({
      where: { id }
    }, info)
  }
}