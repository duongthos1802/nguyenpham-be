import mongoose, { Schema } from 'mongoose'
import timestamp from 'mongoose-timestamp'
// import Double from '@mongoosejs/double'
// constants
import { RECIPE_STATUS } from '../constants/enum'

// const RecipeIngredient = new Schema({
//   item: {
//     type: String
//   },
//   amount: {
//     type: Double
//   }
// })

const Recipe = new Schema(
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
      enum: Object.values(RECIPE_STATUS)
    },
    // category ref
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category'
    },
    priority: {
      type: Number
    },
    isProtected: {
      type: Boolean,
      default: false
    },
    ingredient: {
      type: String
    },
    method: {
      type: String
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
    },
    videoUrl: {
      type: String
    }
  },
  { collection: 'recipes' }
)

Recipe.plugin(timestamp)

export default mongoose.model('Recipe', Recipe)