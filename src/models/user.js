import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { USER_STATUS } from '../constants/enum'

const User = new Schema(
  {
    username: {
      type: String,
      index: {
        unique: true
      },
      require: true
    },
    password: {
      type: String,
      required: true
    },
    isAdmin: {
      type: Boolean,
      default: false
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

User.plugin(timestamp)

export default mongoose.model('User', User)