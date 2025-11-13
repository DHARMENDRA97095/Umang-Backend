import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    username:{type:String, required:true, trim:true},
    name:{type:String,required:true, trim:true},
    email:{type:String,required:true, unique:true},
    password:{type:String, required:true, minlength:6},
    role:{
        type:String,
        enum:['admin','superadmin'],
        default:'admin'    
    },
    isActive:{
        type:Boolean,
        default:true,
    }
},{timestamps:true})

export default mongoose.model.Admin || mongoose.model('Admin', adminSchema);