import mongoose from "mongoose";

const bannerSchema = new  mongoose.Schema({
    title:{
        type:String,
        require:true,
        trim:true,

    },

    image: {
        public_id: {
          type: String,
          required: true,
        },
        url: {
          type: String,
          required: true,
        },
      },

    order:{
        type:Number,
        require:true
    }

}, {timestamps:true})

export default mongoose.model.Banner || mongoose.model('Banner', bannerSchema)