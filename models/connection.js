const mongoose=require("mongoose")
const url="mongodb://localhost:27017/mean89"
mongoose.connect(url)
const db=mongoose.connection
module.exports=db