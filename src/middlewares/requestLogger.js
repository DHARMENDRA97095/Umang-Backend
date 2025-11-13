



export default function requestLogger(req,res,next){
    const date = new Date().toISOString();
    console.log(`${date}, url: ${req.url} ,method: ${req.method} `)
    next()
}