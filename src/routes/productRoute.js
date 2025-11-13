import express from 'express'
import Product from '../models/productModel.js'
import { deleteImage } from '../utils/deleteImage.js';

const router = new express.Router();


router.post("/add",async (req,res)=>{
    const data = req.body;
    if (!data.name || !data.image || !data.description )
    {
        return res.status(400).json({
            success:false,
            message:"Missing Data"
        })
    }
    data.slug = data.name.replace(/\s+/g, "_");
    try {
        const response = await Product.create(data);
        return res.status(201).json({
            success:true,
            data:response
        })
    } catch (error) {
        if(error.errorResponse.code==11000)
        {
          res.status(400).json({success:false,message:`${Object.entries(error.errorResponse.keyValue)[0]} Already exist`})
        }
        res.status(500).json({success:false,message:"Failed to store data"})
    }

    
})


router.get("/getAll",async (req,res)=>{
    try {
        const response = await Product.find();
        return res.status(200).json({success:true, data:response});
        
    } catch (error) {
        return res.status(400).json({success:false, message:error.message});
        
    }
})

router.get("/get/:category",async (req,res)=>{
    const {category} = req.params;
    if (!category)
    {
        return res.status(400).json({success:false, message:"Invalid Category"});

    } 
    try {
        const response = await Product.find({category:category});
        return res.status(200).json({success:true, data:response});
        
    } catch (error) {
        return res.status(400).json({success:false, message:error.message});
        
    }
})

router.delete("/delete/:id/:public_id", async (req, res) => {
    try 
    {
        const { id, public_id } = req.params;
        if(public_id!==0)
        {
          const result = await deleteImage(public_id);
          const deleted = await Product.findByIdAndDelete(id);
    
          if (!deleted) {
              return res.status(404).json({ success: false, message: "Category not found" });
          }
    
          return res.status(200).json({ success: true, message: "Category Deleted" });
        }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
});


// PUT /api/products/:id
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing product id" });
    }

    // Allowed keys (adjust based on your Product schema)
    const allowed = [
      "name",
      "slug",
      "description",
      "price",
      "category",
      "image",   // array of image objects
      "stock",
      "status",
    ];

    const invalidKeys = Object.keys(updates).filter(
      (k) => !allowed.includes(k)
    );
    if (invalidKeys.length > 0) {
      return res
        .status(400)
        .json({ 
            success:false,
            message: `Invalid fields: ${invalidKeys.join(", ")}` });
    }

    // Update product
    const product = await Product.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ 
        success:false,
        message: "Product not found" });
    }

    return res.status(200).json({
      success:true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (err) {
    console.error("Update product error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});

export default router