import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { BLOG_STATUS } from '../constants/enum'

const Blog = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    description: {
      type: String
    },
    slug: {
      type: String
    },
    content: {
      type: String
    },
    author: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS)
    }
  },
  { collection: 'blogs' }
)

Blog.plugin(timestamp)

export default mongoose.model('Blog', Blog)