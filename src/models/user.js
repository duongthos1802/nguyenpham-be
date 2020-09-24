import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
import bcrypt from 'bcryptjs'
// constants
import { USER_STATUS } from '../constants/enum'

const SALT_WORK_FACTOR = 10

const User = new Schema(
  {
    username: {
      type: String,
      index: {
        unique: true
      },
      required: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
    },
    firstTime: {
      type: Boolean,
      default: true
    },
    lastActive: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(USER_STATUS)
    }
  },
  { collection: 'users' }
)

User.pre('save', function (next) {
  let user = this
  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next()

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err)

    // hash the password along with our new salt
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      console.log('hash....', hash)

      // override the cleartext password with the hashed one
      user.password = hash
      next()
    })
  })
})

User.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) {
      console.log('UserSchemaComparePasswordError: ' + err)
      return callback(err)
    }
    callback(null, isMatch)
  })
}

User.plugin(timestamp)

export default mongoose.model('User', User)