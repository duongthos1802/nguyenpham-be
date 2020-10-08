import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/enum'

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
    url: {
      type: String
    },
    urlSlug: {
      type: String
    },
    slug: {
      type: String
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    type: {
      type: String,
      enum: Object.values(CATEGORY_TYPE)
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