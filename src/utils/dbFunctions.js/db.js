

export const storeInDB = async (data, model)=>{
    try{
        const saveData = await model.create(data);
        console.log(saveData);
        return {success:true,saveData};
    }
    catch(error)
    {
        console.log(`Error in saving data: ${error.message}`);
        return {
            success:false,
            message:error.message
        }
    }
}


// export const updateOrder = async (source, destination, model)=>{
//     if(source.order < destination.order)
//     {
//         try{
//             const rows = await model.find({order:{$gte:source.order, $lte:destination.order}},{ _id: 1, order: 1 }).sort({order:1})
//             if(source.order == rows[0].order)
//             {
//                 for (let i = 1; i < rows.length; i++) {
//                 rows[i].order -= 1;
//                 }
//                 rows[0].order = rows[rows.length-1].order + 1;
//                 try {
//                     const success =  await model.bulkWrite(
//                         rows.map((item) => ({
//                             updateOne: {
//                             filter: { _id: item._id },
//                             update: { $set: { order: item.order } },
//                             },
//                         })))
//                         return (success.modifiedCount==rows.length)
//                 } catch (error) {
//                     console.log(error);
//                     return false
//                 }
//             }
//             return false
//         }
//         catch (err){
//             console.log(err);
//             return false;
//         }
//     }
//     else if (source.order > destination.order)
//     {
//         try{
//             const rows = await model.find({order:{$gte:destination.order, $lte:source.order}},{ _id: 1, order: 1 }).sort({order:1})
//             if(rows[rows.length-1].order === source.order )
//             {
//                 for (let i = 0; i < rows.length - 1; i++) {
//                     rows[i].order += 1;
//                 }
//                 rows[rows.length - 1].order = rows[0].order - 1;
//                 try {
//                     const success =  await model.bulkWrite(
//                         rows.map((item) => ({
//                             updateOne: {
//                             filter: { _id: item._id },
//                             update: { $set: { order: item.order } },
//                             },
//                         })))
//                     return (success.modifiedCount==rows.length)
//                 } catch (error) {
//                     console.log(error);
//                     return false
//                 }
//             }
//             else{
//                 return false
//             }
           
//         }
//         catch (err){
//             console.log(err);
//             return false
//         }
//     }
//     else return true    
    
// }

export const updateOrder = async (source, destination, model) => {
    try {
      if (source.order === destination.order) return true;
  
      // Case: moving down
      if (source.order < destination.order) {
        const bulkOps = [
          {
            updateMany: {
              filter: { order: { $gt: source.order, $lte: destination.order } },
              update: { $inc: { order: -1 } }, // shift range up by -1
            },
          },
          {
            updateOne: {
              filter: { _id: source._id },
              update: { $set: { order: destination.order } },
            },
          },
        ];
  
        const result = await model.bulkWrite(bulkOps);
        return result.modifiedCount > 0;
      }
  
      // Case: moving up
      if (source.order > destination.order) {
        const bulkOps = [
          {
            updateMany: {
              filter: { order: { $gte: destination.order, $lt: source.order } },
              update: { $inc: { order: 1 } }, // shift range down by +1
            },
          },
          {
            updateOne: {
              filter: { _id: source._id },
              update: { $set: { order: destination.order } },
            },
          },
        ];
  
        const result = await model.bulkWrite(bulkOps);
        return result.modifiedCount > 0;
      }
    } catch (err) {
      console.error("Order update failed:", err);
      throw new Error("Database update error");
    }
  };
  


