import  express from "express";
import Banner from '../models/bannerModel.js'
import { storeInDB, updateOrder } from "../utils/dbFunctions.js/db.js";


const router = express.Router()


router.post("/addBanner",async (req,res)=>{
    const {saveData,reorder} = req.body;
    if(!saveData.title || !saveData.image || !saveData.order)
    {
        return res.status(400).json({
            success:false,
            message:"Inappropriate Data"
        })
    }
    if(!reorder)
    {
        const response= await storeInDB(saveData, Banner);
        if(response.success)
        return res.status(201).json(response);
        return res.status(503).json(response);
    }
    else{
        try {
            // Step 1 + Step 2 ek hi bulkWrite me
            const operations = [
              {
                updateMany: {
                  filter: { order: { $gte: saveData.order } },
                  update: { $inc: { order: 1 } }
                }
              },
              {
                insertOne: {
                  document: saveData
                }
              }
            ];
        
            const result = await Banner.bulkWrite(operations);
            const insertedId = result.result.insertedIds
                                ? result.result.insertedIds[0] 
                                : Object.values(result.insertedIds)[0];
            const response = {saveData:{...saveData,_id:insertedId},success:true}
            return res.status(201).json(response);
          } catch (error) {
            console.error(error);
            return res.status(500).json({
              success: false,
              message: "Error inserting banner",
            });
          }
    }
})

router.get("/getBanners", async (req, res)=>{
    try{
        const data = await Banner.find().sort({order:1});
        if (data)
        {
            return res.status(200).json(data)
        }
        else
        {
            return res.status(400).json({success:false, message: "No data available"})
        }
    }
    catch(err)
    {
        return res.status(400).json({success:false, message: err.message})

    }
})

router.put("/updateOrder",(req,res)=>{

    const {source, destination} = req.body
    if (source || destination)
    {   
        updateOrder(source,destination,Banner)

    }
    res.status(200).json({success:true})
})


// DELETE Banner
router.delete("/delete/:id/:order", async (req, res) => {
    try {
      const { id, order } = req.params;
  
      const orderNum = Number(order);
  
      const deleted = await Banner.findByIdAndDelete(id);
  
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Banner not found" });
      }
  
      if (orderNum === 0) {
        return res.status(200).json({ success: true, message: "Banner deleted successfully (last item)" });
      }
  
      await Banner.updateMany(
        { order: { $gt: orderNum } },       
        { $inc: { order: -1 } }            
      );
  
      return res.status(200).json({ success: true, message: "Banner deleted and reordered successfully" });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

export default router