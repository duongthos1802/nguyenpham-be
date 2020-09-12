
import { ApolloServer, gql } from "apollo-server-express";
import express from "express";
import mongoose from "mongoose";
import { resolvers } from "./resolvers";
import { typeDefs } from "./typeDefs";
import server from './apollo-server'

const startServer = async () => {
  const app = express();

  // console.log('process.env.PORT.....', process.env.PORT);
  // const server = new ApolloServer({
  //   typeDefs,
  //   resolvers
  // });


  server.applyMiddleware({
    app,
    path: '/',
    cors: true,
    onHealthCheck: () =>
      // eslint-disable-next-line no-undef
      new Promise((resolve, reject) => {
        if (mongoose.connection.readyState > 0) {
          resolve()
        } else {
          reject()
        }
      })
  })

  await mongoose.connect("mongodb://localhost:27017/test3", {
    useNewUrlParser: true
  });

  app.listen({ port: 2000 }, () =>
    console.log(`🚀 Server ready at http://localhost:2000`)
  );
};

startServer();