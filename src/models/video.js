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
    slug: {
      type: String
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    images: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File'
      }
    ],
    pictures: {
      type: [String]
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