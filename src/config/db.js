//controlling applications environment constants.
require('dotenv').config()
//connect to mongoDB
const mongoose = require('mongoose')
mongoose.
connect("mongodb+srv://jiheenguesmi:rSStsDiofCsBsM3p@cluster0.n6sz76y.mongodb.net/",{useNewUrlParser:true,useUnifiedTopology:true,})
.then(()=>{
console.log("DB Connected")
})
.catch((error)=>{
console.log(error)
})