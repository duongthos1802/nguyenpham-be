import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const HtmlBlock = new Schema(
  {
    code: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String
    },
    content: {
      type: String
    }
  },
  {
    collection: 'htmlBlocks'
  }
)

HtmlBlock.plugin(timestamp)

export default mongoose.model('HtmlBlock', HtmlBlock)
