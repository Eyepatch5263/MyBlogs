const { profile } = require("console")
const JWT=require("jsonwebtoken")
const secret="@vndfjkgbrdgrgbrkb"

const createTokenForUser=(user)=>{
    const payload={
        _id:user._id,
        email:user.email,
        role:user.role,
        name:user.name,
        profileImage:user.profileImage
    }
    const token=JWT.sign(payload,secret)
    return token
}

const validateToken=(token)=>{
    try {
        const payload=JWT.verify(token,secret)
        return payload
    } catch (error) {
        return error
    }
}

module.exports={createTokenForUser,validateToken}