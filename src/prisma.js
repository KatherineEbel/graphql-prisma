import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466',
})

// prisma.query prisma.mutation prisma.subscription prisma.exists

// prisma.query.users(null, '{ id name posts { id title } }').then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })

prisma.query.comments(null, '{ id text author { id name } }')
  .then((data) => {
    console.log(JSON.stringify(data, undefined, 2))
  }).catch(err => console.log(err.message))

prisma.mutation.updatePost({
  data: {
    body: "New post content",
    published: true
  },
  where: {
    id: "cjmxse016000s0b616niyvdkk"
  }
}, '{ id, body, published }').then(data => {
  return prisma.query.posts(null, '{ id body, published }')
}).then(data => {
  console.log(JSON.stringify(data, undefined, 2))
})
// prisma.mutation.createPost({
//   data: {
//     title: "101 GraphQL",
//     body: "",
//     published: false,
//     author: {
//       connect: {
//         id: "cjmvwu6pt002d0898qb25sato"
//       }
//     }
//   }
// }, '{ id title body published }').then(data => {
//   return prisma.query.users(null, '{ id posts { id title } }')
// }).then(data => {
//   console.log(JSON.stringify(data, undefined, 2))
// })