import mongoose, { Schema } from 'mongoose'

const { ObjectId } = mongoose.Types
ObjectId.prototype.valueOf = function () {
  return this.toString()
}

const File = new Schema(
  {
    filename: {
      type: String
    },
    mimetype: {
      type: String
    },
    fileExtension: {
      type: String
    },
    encoding: {
      type: String
    },
    fileType: {
      type: String
    },
    originalUrl: {
      type: String
    },
    contentType: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    updatedAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    collection: 'File'
  }
)

// File.plugin(timestamp)
// File.index({ createdAt: 1, updatedAt: 1 })

export default mongoose.model('File', File)
