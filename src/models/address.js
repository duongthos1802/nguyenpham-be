import mongoose, { Schema } from 'mongoose'

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

export default mongoose.model('Address', Address)