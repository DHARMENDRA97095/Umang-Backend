import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: String,
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
      
    }, 
  },
  { timestamps: true }
);

export default mongoose.model.Category || mongoose.model("BlogCategory", categorySchema);
