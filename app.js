require("dotenv").config()

const express=require("express")
const PORT=process.env.PORT
const app=express()
const path=require('path')
const mongoose=require("mongoose")
const userRouter=require('./routes/user')
const blogRouter=require('./routes/blog')
const cookieParser=require('cookie-parser')
const { checkForAuthCookie } = require("./middlewares/auth")
const Blog=require('./modal/blogs')


mongoose.connect(process.env.MONGO_URL)
.then((err)=>console.log("mongoDb successfully connected"))
app.set("view engine" ,"ejs")
app.set("views",path.resolve('./views'))

app.use(express.urlencoded({extended:false}))
app.use(cookieParser())
app.use(checkForAuthCookie("token"))
app.use(express.static(path.resolve("./public"))) //this middleware is used to statically serve the files for ex- images in public
app.use(express.static(path.resolve('./public/images')))
app.get('/',async(req,res)=>{
    const allBlog= await Blog.find({}).sort("createdAt")
    res.render("home",{
        user:req.user,
        blogs:allBlog,
    })
})
app.use('/user',userRouter)

app.use('/',blogRouter)
app.listen(PORT,()=>console.log(`Listening on port ${PORT}`))