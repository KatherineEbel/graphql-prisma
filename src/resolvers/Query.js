import { getUserId } from '../utils'

export default {
    users(parent, args, { prisma }, info) {
      const { first, skip, after, orderBy } = args
      const opArgs = {
        first, skip, after, orderBy
      }
      if (args.query) {
        opArgs.where = {
          OR: [{
            name_contains: args.query
          }]
        }
      }
      return prisma.query.users(opArgs, info)
    },
    posts(parent, args, { prisma }, info) { // additional params are ctx and info
      const { first, skip, after, orderBy } = args
      const opArgs = {
        first,
        skip,
        after,
        orderBy,
        where: { published: true }
      }
      if (args.query) {
        opArgs.where.OR = [{
            title_contains: args.query
          }, {
            body_contains: args.query
          }]
      }
      return prisma.query.posts(opArgs, info)
    },
    comments(parent, args, { prisma }, info) {
      const { first, skip, after, orderBy } = args
      const opArgs = {
        first, skip, after, orderBy
      }
      return prisma.query.comments(opArgs, info)
    },
    async post(parent, args, { prisma, request }, info) {
      const userId = getUserId(request, false)
      const [post] = await prisma.query.posts({
        where: {
          id: args.id,
          OR: [{
            published: true
          }, {
            author: {
              id: userId
            }
          }]
        }
      })
      if (!post) throw new Error('Post not found')
      return post
    },
    async me(parent, args, { prisma, request }, info) {
      const userId = getUserId(request)
      const opArgs = {
        where: {
          author: { id: userId }
        }
      }
      return await prisma.query.user({
        where: { id: userId }
      })
    },
    myPosts(parent, args, { prisma, request}, info) {
      const userId = getUserId(request)
      const { first, skip, after, orderBy } = args
      const opArgs = {
        first,
        skip,
        after,
        orderBy,
        where: {
          author: { id: userId }
        }
      }
  
      if (args.query) {
        opArgs.where.OR = [{
          title_contains: args.query
        }, {
          body_contains: args.query
        }]
      }
      return prisma.query.posts(opArgs, info)
    }
}

