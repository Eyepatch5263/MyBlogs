const mongoose=require('mongoose')
const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    coverImage:{
        type:String,
        required:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
},{timestamps:true})

const Blog=mongoose.model("blogs",blogSchema)

module.exports=Blog