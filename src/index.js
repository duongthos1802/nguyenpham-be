import express from "express";
import mongoose from "mongoose";
import server from './apollo-server'

import './mongoose'

const app = express()

server.applyMiddleware({
  app,
  path: '/',
  cors: true,
  onHealthCheck: () =>
    // eslint-disable-next-line no-undef
    new Promise((resolve, reject) => {

      console.log('resolve....', resolve);
      if (mongoose.connection.readyState > 0) {
        resolve()
      } else {
        reject()
      }
    })
})


app.listen({ port: 5000 }, () =>
  console.log(`🚀 Server ready at http://localhost:5000`)
);
