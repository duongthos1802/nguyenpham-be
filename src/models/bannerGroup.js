import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const BannerGroup = new Schema(
  {
    name: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    collection: 'bannergroups'
  }
)

BannerGroup.plugin(timestamp)

export default mongoose.model('BannerGroup', BannerGroup)
