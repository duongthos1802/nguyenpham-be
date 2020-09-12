import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

mongoose.Promise = global.Promise

const DATABASE_NAME = 'teamo_dev'
const DATABASE_HOST = 'localhost:27017'
const DATABASE_USER = 'teamo'
const DATABASE_PASSWORD = 'teamo'

const connectionUri = `mongodb://${DATABASE_USER}:${DATABASE_PASSWORD}@${DATABASE_HOST}/${DATABASE_NAME}`

console.log('connectionUri......', connectionUri)
const connection = mongoose.connect(connectionUri, {
  autoIndex: true,
  poolSize: 50,
  bufferMaxEntries: 0,
  keepAlive: 120,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

mongoose.set('useCreateIndex', true)
// show logging
mongoose.set('debug', true)

connection
  .then((db) => {
    console.log('connected.....')
    return db
  })
  .catch((err) => {
    console.log('connect fail....')
    console.log(err)
  })

export default connection
