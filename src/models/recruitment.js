import mongoose, { Schema } from "mongoose";
import timestamp from "mongoose-timestamp";
// constants
import { BLOG_STATUS } from "../constants/enum";

const Recruitment = new Schema(
  {
    name: {
      type: String,
      require: true,
    },
    salary: {
      type: String,
    },
    content: {
      type: String,
    },
    address: {
      type: String,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    timeWork: {  
      type: String,
    }, 
    status: {
      type: String,
      enum: Object.values(BLOG_STATUS),
    }
  },
  { collection: "recruitments" }
);

Recruitment.plugin(timestamp);

export default mongoose.model("Recruitment", Recruitment);
