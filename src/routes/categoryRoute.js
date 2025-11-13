import  express from "express";
import Category from '../models/categoryModel.js' 
import { deleteImage } from "../utils/deleteImage.js";
import Product from '../models/productModel.js'

const router = express.Router()


router.post("/add",async (req,res)=>{
    const data = req.body
    if(!data.name)
    {
        return res.status(400).json({success:false, message: "Necessary fileds are missing"});
    }
    if(!data.slug)
    data.slug = data.name.replace(/\s+/g, "_");
    else
    {
    data.slug = data.slug.replace(/\s+/g, "_");
    }
    try{
        const response = await Category.create(data);
        return res.status(200).json({success:true, data:response});
        
    }catch(error)
    {
        if(error.errorResponse.code == 11000)
        {
          return res.status(400).json({success:false,message:`${Object.entries(error.errorResponse.keyValue)[0]} already Exist`});

        }
        return res.status(500).json({success:false,message:error.message});
        
    }
})


router.get("/getAll",async (req,res)=>{
    try {
        const response = await Category.find();
        return res.status(200).json({success:true, data:response});
        
    } catch (error) {
        return res.status(400).json({success:false, message:error.message});
        
    }
    
})




router.delete("/delete/:id/:public_id", async (req, res) => {
    const { id, public_id } = req.params;
  
    try {
      // Delete image if exists
      if (public_id && public_id !== "0") {
        await deleteImage(public_id);
      }
  
      // Delete category
      const deletedCategory = await Category.findByIdAndDelete(id);
      if (!deletedCategory) {
        return res.status(404).json({ success: false, message: "Category not found" });
      }
  
      // Delete all products linked to this category
      await Product.deleteMany({ category: id });
  
      return res.status(200).json({ success: true, message: "Category and related products deleted" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });


  
  
  

router.get("/getCategory", async (req,res)=>{
    try {
        const response = await Category.find({},{name:1,_id:1});
        return res.status(200).json({success:true, data:response});
        
    } catch (error) {
        return res.status(400).json({success:false, message:error.message});
        
    }
})


// routes/category.js
router.put("/update/:id", async (req, res) => {
    
    try {
      const { id } = req.params;
  
      // accept only allowed keys
      const allowed = ["name", "slug", "description", "image"];
      const updates = {};
      for (let key of allowed) {
        if (req.body[key] !== undefined) {
          updates[key] = req.body[key];
        }
      }
  
      if (Object.keys(updates).length === 0) {
        return res.status(400).json({ message: "No valid fields to update" });
      }
  
      const category = await Category.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
  
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      res.json({ success: true, category });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  });
  

export default router