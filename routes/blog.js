const express = require("express")
const router = express.Router()
const multer = require('multer')
const path=require('path')
const Blog=require('../modal/blogs')
const Comment=require('../modal/comment')

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.resolve(`./public/uploads/`))
    },
    filename: function (req, file, cb) {
        const filename=`${Date.now()}- ${file.originalname}`
        cb(null,filename)
    }
})

const upload = multer({ storage: storage })
router.get('/add-new', (req, res) => {
    res.render('addBlog', {
        user: req.user
    })
})

router.get('/:id',async(req,res)=>{
    const blog=await Blog.findById(req.params.id).populate("createdBy")
    const comments=await Comment.find({blogId:req.params.id}).populate("createdBy")
    return res.render('blog',{
        user:req.user,
        blog:blog,
        comments
    })
})

router.post('/comment/:blogId',async(req,res)=>{
    const comment=await Comment.create({
        content:req.body.content,
        createdBy:req.user._id,
        blogId:req.params.blogId
    })
    console.log(comment)
    return res.redirect(`/${req.params.blogId}`)
})

router.post('/blog',upload.single("coverImage"), async(req, res) => {
    const blog=await Blog.create({
        Date:Date.now(),
        title: req.body.title,
        body: req.body.body,
        createdBy:req.user._id,
        coverImage:`uploads/${req.file.filename}`
    })
    res.redirect('/')
})
module.exports = router