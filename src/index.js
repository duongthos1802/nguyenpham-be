// libs
import dotenv from 'dotenv'
import express from "express";
import mongoose from "mongoose";
import server from './apollo-server'
// database
import './mongoose'
// helpers 
import imageHelper from './helper/image'

const app = express()
dotenv.config()

// image
var multer = require('multer')
var fs = require('fs-extra')
var cors = require('cors')


// Define port for app to listen on
const port =  process.env.PORT || 4000;

/* ==================================================== */
/* =====                                          ===== */
/* =====       Define folder storage image        ===== */
/* =====                                          ===== */
/* ==================================================== */
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const disk = imageHelper.generatePathFileByType(req.headers.uploadtype)
    const path = `./${disk}`
    fs.mkdirsSync(path)
    cb(null, path)
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`)
  }
})

var upload = false
  ? multer().array('file')
  : multer({ storage: storage }).array('file')


app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors())

/* ==================================================== */
/* =====                                          ===== */
/* =====           Define upload folder           ===== */
/* =====                                          ===== */
/* ==================================================== */
app.use('/uploads', express.static('uploads'))
 
/* ==================================================== */
/* =====                                          ===== */
/* =====              Making Routes               ===== */
/* =====                                          ===== */
/* ==================================================== */

app.post('/uploads', (req, res) => {
  upload(req, res, function async(err) {
    if (err instanceof multer.MulterError) {
      console.log('err...1', err)
      return res.status(500).json(err)
      // A Multer error occurred when uploading.
    } else if (err) {
      console.log('err...', err)
      return res.status(500).json(err)
      // An unknown error occurred when uploading.
    }
    //check
    imageHelper.uploadMultipleFiles(req, res)
    // Everything went fine.
  })
})

/* ==================================================== */
/* =====                                          ===== */
/* =====       Configure express middlewares      ===== */
/* =====                                          ===== */
/* ==================================================== */
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


// To make the server live
app.listen({ port: port }, () =>
  console.log(`🚀 Server ready on port ${port}`)
);
