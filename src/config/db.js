//controlling applications environment constants.
require('dotenv').config()
//connect to mongoDB
const mongoose = require('mongoose')
mongoose.
connect(process.env.MONGODB_URI,{useNewUrlParser:true,useUnifiedTopology:true,})
.then(()=>{
console.log("DB Connected")
})
.catch((error)=>{
console.log(error)
})