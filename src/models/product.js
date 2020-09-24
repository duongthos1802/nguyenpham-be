import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
import Double from '@mongoosejs/double'
// constants
import { PRODUCT_STATUS } from '../constants/enum'

const ProductIngredient = new Schema({
  item: {
    type: String
  },
  amount: {
    type: Double
  }
})

const Product = new Schema(
  {
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
      enum: Object.values(PRODUCT_STATUS)
    },
    // category ref
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    content: {
      type: String
    },
    priority: {
      type: Number
    },
    ingredient: {
      type: [ProductIngredient]
    },
    method: {
      type: [String]
    },
    level: {
      type: Number
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
  { collection: 'products' }
)

Product.plugin(timestamp)

export default mongoose.model('Product', Product)