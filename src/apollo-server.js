import { ApolloServer } from 'apollo-server-express'
import { MongooseDataloaderFactory } from 'graphql-dataloader-mongoose'
import dotenv from 'dotenv'
import schema from './schemas'
import models from './models'

dotenv.config()

const server = new ApolloServer({
  schema,
  cors: true,
  playground: process.env.NODE_ENV === 'development' ? true : false,
  // playground: false,
  maxFileSize: 25 * 1024 * 1024,
  introspection: true,
  tracing: true,
  path: '/',
  context: async () => {
    return {
      models,
      dataloaderFactory: new MongooseDataloaderFactory()
    }
  }
})

export default server
