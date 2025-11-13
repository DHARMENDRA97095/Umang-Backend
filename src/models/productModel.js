import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique:true
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description:{type:String},
    image: {
      url:{type:String},
      public:{type:String}
    },
    category: 
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category", // many-to-many relation
      },
    
    features:[{
      title:  String,
      value: String,
      badge: String
    }]
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
