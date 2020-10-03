import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Page = new Schema(
  {
    name: {
      type: String
    },
    urlFrontEnd: {
      type: String
    },
    router: {
      type: String
    },
    pathPageConfig: {
      type: [String]
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
    config: {
      type: String
    },
    isHomePage: {
      type: Boolean,
      default: false
    }
  },
  {
    collection: 'pages'
  }
)

Page.plugin(timestamp)
Page.index({ createdAt: 1, updatedAt: 1 })

export default mongoose.model('Page', Page)
