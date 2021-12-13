const { context, prisma } = require('./context')
const express = require('express')
const http = require('http')
const { join } = require('path')
// Apollo Server
const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
// GraphQL Tools
const { loadFilesSync } = require('@graphql-tools/load-files')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { applyMiddleware } = require('graphql-middleware')

async function startApolloServer () {
  // Required logic for integrating with Express
  const app = express()
  const httpServer = http.createServer(app)

  // Load schema from .graphql files
  const typeDefs = loadFilesSync(join(__dirname, './graphql'))

  const schema = makeExecutableSchema({ typeDefs })

  // Same ApolloServer initialization as always, plus the drain plugin.
  const server = new ApolloServer({
    schema: schema,
    context: request => {
      return {
        ...request,
        prisma
      }
    },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })]
  })

  // More required logic for integrating with Express
  await server.start()
  server.applyMiddleware({ app, path: '/' })

  // Modified server startup
  await new Promise(resolve => httpServer.listen({ port: 4000 }, resolve))
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
}

startApolloServer()
