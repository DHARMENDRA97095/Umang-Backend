import  express from "express";
import Category from '../models/categoryModel.js' 
import Product from '../models/productModel.js'
// import Blogs from '../models/'
import Banner from '../models/bannerModel.js'

const router = express.Router()


// export const getDashboardStats = 


router.get('/count',async (req, res) => {
    try {
      const counts = await Promise.all([
        Banner.estimatedDocumentCount(),
        Category.estimatedDocumentCount(),
        Product.estimatedDocumentCount(),
        // Inquiry.estimatedDocumentCount(),
        // Blog.estimatedDocumentCount(),
      ]);
      const obj = {banners:counts[0], categories:counts[1], products:counts[2] };
      console.log(obj);
      res.status(200).json({
        success: true,
        data: obj,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error fetching stats",
        error: error.message,
      });
    }
  })

  export default router