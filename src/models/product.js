import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { PRODUCT_STATUS } from '../constants/enum'


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
    category: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }],
    application: {
      type: String
    },
    attribute: {
      type: String
    },
    packing: {
      type: String
    },
    expirationDate: {
      type: String
    },
    tutorial: {
      type: String
    },
    preservation: {
      type: String
    },
    isPriority: {
      type: Boolean,
      default: false
    },
    logo: {
      type: String
    },
    recipes: [{
      type: Schema.Types.ObjectId,
      ref: 'Recipe'
    }],
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
    },
  },
  { collection: 'products' }
)

Product.plugin(timestamp)

export default mongoose.model('Product', Product)