import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// constants
import { CATEGORY_STATUS, CATEGORY_OPTION, CUSTOMER_STATUS } from '../constants/enum'

const Customer = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    description: {
      type: String
    },
    phone: {
      type: String
    },
    address: {
      type: String
    },
    email: {
      type: String
    },
    status: {
      type: String,
      enum: Object.values(CUSTOMER_STATUS)
    }
  },
  { collection: 'customers' }
)

Customer.plugin(timestamp)

export default mongoose.model('Customer', Customer)