import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
import { FAQ_STATUS } from '../constants/enum'

const FAQ = new Schema(
  {
    title: {
      type: String,
      required: true
    },
    answer: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(FAQ_STATUS)
    },
    priority: {
      type: Number
    }
  },
  {
    collection: 'FAQs'
  }
)

FAQ.plugin(timestamp)
export default mongoose.model('FAQ', FAQ)
