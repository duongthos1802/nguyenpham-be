import mongoose, { Schema } from "mongoose";
import timestamp from "mongoose-timestamp";
// constants
import { CATEGORY_STATUS, CATEGORY_OPTION, CATEGORY_TYPE_BRAND } from "../constants/enum";

const Category = new Schema(
  {
    index: {
      type: Number,
      unique: true,
    },
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
    },
    slug: {
      type: String,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    status: {
      type: String,
      enum: Object.values(CATEGORY_STATUS),
    },
    metaTitle: {
      type: String,
    },
    metaDescription: {
      type: String,
    },
    metaKeyword: {
      type: String,
    },
    image: {
      type: String,
    },
    imageFile: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    banner: {
      type: String,
    },
    option: {
      type: String,
      enum: Object.values(CATEGORY_OPTION),
    },
    typeBrand: {
      type: String,
      enum: Object.values(CATEGORY_TYPE_BRAND),
    },
    content: {
      type: String,
    },
    blogId: {
      type: Schema.Types.ObjectId,
      ref: "Blog",
    },
    brands: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],
    isHome: {
      type: Boolean,
      default: false,
    },
    isBrand: {
      type: Boolean,
      default: false,
    },
    isMenu: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "categories" }
);

Category.plugin(timestamp);

export default mongoose.model("Category", Category);
