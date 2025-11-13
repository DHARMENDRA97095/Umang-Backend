import express from 'express'
import {v2 as cloudinary} from "cloudinary"
import { deleteImage } from '../utils/deleteImage.js';

const router = express.Router();


  
router.get("/generateSignature", (_, res)=>{

    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
   
    try{
        const timestamp = Math.floor(Date.now() / 1000);
        
        const signature = cloudinary.utils.api_sign_request(
            {timestamp},
            process.env.CLOUDINARY_API_SECRET
        );

        res.status(200).json({
            signature,
            timestamp,
            apiKey:process.env.CLOUDINARY_API_KEY,
            cloudName:process.env.CLOUDINARY_CLOUD_NAME,
        });
    }
    catch (err){
        console.error(err)
        res.status(500).json({
            success:false,
            error:"Failed To Generate Signature"
        });

    }
})


// router.delete("/delete/:public_id",async (req,res)=>{
    
//     const {public_id} = req.params
//     console.log(public_id);
//     const response = await deleteImage(public_id)
//     res.status(200).json({success:true})
// })

router.delete("/delete/:public_id", async (req, res) => {
  console.log("hiihhihihi");
    const { public_id } = req.params;
  
    try {
      // Delete image if exists
      if (public_id && public_id !== "0") {
        await deleteImage(public_id);
      }
  
      return res.status(200).json({ success: true, message: "Image Deleted Successfylly" });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ success: false, message: "Server error" });
    }
  });


export default router