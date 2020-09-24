import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Location = new Schema(
  {
    name: {
      type: String
    },
    embeded: {
      type: String
    }
  },
  { collection: 'locations' }
)

Location.plugin(timestamp)

export default mongoose.model('Location', Location)