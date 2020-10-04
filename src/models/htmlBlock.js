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
    },
    image: {
      type: String
    },
    images: {
      type: [String]
    },
    pictures: {
      type: [String]
    },

    // ref file
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File'
      }
    ],
    htmlBlockGroup: {
      type: Schema.Types.ObjectId,
      ref: 'HtmlBlockGroup'
    }
  },
  {
    collection: 'htmlBlocks'
  }
)

HtmlBlock.plugin(timestamp)

export default mongoose.model('HtmlBlock', HtmlBlock)
