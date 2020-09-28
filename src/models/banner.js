import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Banner = new Schema({
  name: {
    type: String
  },
  url: {
    type: String
  },
  description: {
    type: String
  },
  image: {
    type: String
  },
  published: {
    type: Boolean,
    default: true
  },
  images: {
    type: [String]
  },
  // ref file
  files: [
    {
      type: Schema.Types.ObjectId,
      ref: 'File'
    }
  ],
  // ref recipe
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe'
  },
  // ref category
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category'
  },
  // ref banner group
  bannerGroup: {
    type: Schema.Types.ObjectId,
    ref: 'BannerGroup'
  }
})

Banner.plugin(timestamp)

export default mongoose.model('Banner', Banner)
