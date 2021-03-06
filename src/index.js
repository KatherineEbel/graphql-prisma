import '@babel/polyfill/noConflict'
import { GraphQLServer } from 'graphql-yoga'
import prisma from './prisma'
import { resolvers, fragmentReplacements } from './resolvers'

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers,
  context(request) {
    return {
      prisma,
      request
    }
  },
  fragmentReplacements
})


server.start({ port: process.env.PORT || 4000 })
      .then(() => console.log('The server is up!'))
