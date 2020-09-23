import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { CATEGORY_STATUS } from '../constants/enum'

const Category = new Schema(
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
    status: {
      type: String,
      enum: Object.values(CATEGORY_STATUS)
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
    image: {
      type: String
    },
    imageFile: {
      type: Schema.Types.ObjectId,
      ref: 'File'
    },
    banner: {
      type: String
    }
  },
  { collection: 'categories' }
)

Category.plugin(timestamp)

export default mongoose.model('Category', Category)