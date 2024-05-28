const mongoose=require('mongoose')
const {randomBytes,createHmac}=require("crypto")
const { createTokenForUser } = require('../services/auth')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    salt:{
        type:String,
    },
    isAdmin:{
        type:Boolean,
        required:true,
        default:false
    },
    profileImage:{
        type:String,
        required:true,
        default:'/images/default.png'
    },
    role:{
        type:String,
        enum:["USER","ADMIN"],
        default:"USER"
    }
},{timestamps:true})

userSchema.pre("save",function (next){
    const user=this
    if(!user.isModified){
        return
    }
    const salt=randomBytes(12).toString()
    const hashedPassword=createHmac("sha256",salt).update(user.password).digest("hex")
    this.salt=salt
    this.password=hashedPassword
    next()
})

userSchema.static("matchPasswordAndGenerateToken",async function(email,password){
    const user=await User.findOne({email})
    if(!user){
        throw new Error("User not found")
    }
    const salt=user.salt
    const hashedPassword=user.password
    const userProvidedHashedPassword=createHmac("sha256",salt).update(password).digest("hex")
    if(hashedPassword!==userProvidedHashedPassword){
        throw new Error("Invalid Password")
    }
    const token=createTokenForUser(user)
    return token
})
const User=mongoose.model('user',userSchema)

module.exports={User}