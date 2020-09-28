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
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    logo: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File'
      }
    ],
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
  },
  { collection: 'products' }
)

Product.plugin(timestamp)

export default mongoose.model('Product', Product)