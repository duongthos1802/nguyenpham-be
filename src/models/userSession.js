import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const UserSession = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  {
    collection: 'usersessions'
  }
)

UserSession.plugin(timestamp)

export default mongoose.model('UserSession', UserSession)
