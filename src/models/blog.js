import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { BLOG_STATUS } from '../constants/enum'

const Blog = new Schema(
  {
    index: {
      type: Number,
      unique: true
    },
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
    createdBy: {
      type: String
    },
    updatedBy: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS)
    },
    metaTitle: {
      type: String
    },
    metaDescription: {
      type: String
    },
    metaKeyword: {
      type: String
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
    picturesThumbnails: {
      type: [String]
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  { collection: 'blogs' }
)

Blog.plugin(timestamp)

export default mongoose.model('Blog', Blog)