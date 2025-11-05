import mongoose from "mongoose";

const statisticsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    num: {
      type: Number,
      required: true,
    },
    color: {
      type: String,
      default: "#00d097",
    },
    background: {
      type: String,
      default: "#FFFFFF",
    },
  },
  { timestamps: true }
);

const Statistics = mongoose.model("Statistics", statisticsSchema);
export default Statistics;
