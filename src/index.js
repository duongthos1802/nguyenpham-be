import dotenv from 'dotenv'
import express from "express";
import mongoose from "mongoose";
import server from './apollo-server'

import './mongoose'

dotenv.config()
const app = express()

app.post('/uploads', (req, res) => {
  upload(req, res, function async(err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err)
      // A Multer error occurred when uploading.
    } else if (err) {
      return res.status(500).json(err)
      // An unknown error occurred when uploading.
    }
    //check
    uploadMultipleFiles(req, res)
    // Everything went fine.
  })
})

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

app.listen({ port: process.env.PORT }, () =>
  console.log(`🚀 Server ready at http://localhost:${process.env.PORT}`)
);
