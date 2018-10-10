import { getUserId } from '../utils'

export default {
  email: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, {prisma, request}, info) {
      const userId = getUserId(request, false)
      if (userId && userId === parent.id) {
        return parent.email
      } else {
        return null
      }
    }
  },
  password() {
     return null
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }) {
      return prisma.query.posts({
        where: {
          published: true,
          author: {
            id: parent.id
          }
        }
      })
    }
  }
}