import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
import { VIDEO_STATUS } from '../constants/enum'

const Video = new Schema(
  {
    url: {
      type: String,
      required: true
    },
    content: {
      type: String,
    },
    title: {
      type: String
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    status: {
      type: String,
      enum: Object.values(VIDEO_STATUS)
    }
  },
  { collection: 'videos' }
)

Video.plugin(timestamp)

export default mongoose.model('Video', Video)