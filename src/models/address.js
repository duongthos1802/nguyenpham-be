import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'

const Address = new Schema(
  {
    address: {
      type: String
    },
    city: {
      type: String
    },
    zipCode: {
      type: String
    }
  },
  { collection: 'address' }
)

Address.plugin(timestamp)

export default mongoose.model('Address', Address)