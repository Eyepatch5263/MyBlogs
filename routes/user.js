const express=require('express')
const { User } = require('../modal/user')
const router=express.Router()

router.get('/signin',(req,res)=>{
    return res.render('signin')
})
router.get('/signup',(req,res)=>{
    res.render('signup')
})

router.post('/signup',async(req,res)=>{
    const {name,email,password}=req.body
    try {
        const user=await User.create({
            name:name,
            email:email,
            password:password
        })
        console.log(user)
        return res.render("signin",{message:"User Created Successfully"})
    } catch (error) {
        console.log(error)
    }
})

router.post('/signin',async(req,res)=>{
    const {email,password}=req.body
    console.log(req.body)
    try {
        const token=await User.matchPasswordAndGenerateToken(email,password)
        return res.cookie("token",token).redirect('/')
    } catch (error) {
        return res.render('signin',{error:"Incorrect email or password"})
    }
})

router.post
module.exports=router