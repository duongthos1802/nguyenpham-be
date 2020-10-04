import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const HtmlBlockGroup = new Schema(
  {
    name: {
      type: String
    },
    description: {
      type: String
    }
  },
  {
    collection: 'HtmlBlockGroups'
  }
)

HtmlBlockGroup.plugin(timestamp)

export default mongoose.model('HtmlBlockGroup', HtmlBlockGroup)
