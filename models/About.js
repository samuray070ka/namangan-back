import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema({
  title: String,
  subtitle: String,
  code: String,
  text: String,
  button: String,
});

export default mongoose.model("About", aboutSchema);