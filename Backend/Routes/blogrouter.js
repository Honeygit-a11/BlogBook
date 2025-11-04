const express =require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { verifyToken ,isAdmin} = require("../middleware/authmiddleware");
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// create a blog
router.post("/create", verifyToken, upload.single('image'), async (req, res) => {
    try {
        let imagePath = req.body.image; // Default to provided URL
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`; // Use uploaded file path
        }

        // author should come from authenticated user
        const blog = new Blog({ ...req.body, image: imagePath, author: req.user.id });
        await blog.save();
        return res.status(201).json(blog);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// get all blogs
router.get("/",async(req,res)=>{
    try{
    const blogs = await Blog.find().populate("author","username email");
        res.json(blogs);
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

//get a single blog

router.get("/:id",async(req,res) =>{
   
    
    try{
        console.log(req.params.id);
        
    const blog =await Blog.findById({_id: req.params.id}).populate("author","username");
        if(!blog) return res.status(404).json({message:"Blog not found"});
        res.json(blog);
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

// update blog

router.put("/:id",verifyToken,async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({message:"Blog not found"});
        if(blog.author.toString() !== req.user.id && req.user.role !== 'admin'){
            return res.status(403).json({message:"unauthorized"});
        }
        const updated = await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true});
        res.json(updated);
}catch(error){
    res.status(500).json({error:error.message});
}
});

//delete blog
router.delete("/:id", verifyToken,async(req,res)=>{
    try{
        const blog = await Blog.findById(req.params.id);
        if(!blog) return res.status(404).json({message:"blog not found"});
        if (blog.author.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: "unauthorized" });
        }

        await blog.deleteOne();
        return res.json({ message: "Blog delete successful" });

    }
    catch(error){
        res.status(500).json({error:error.message});
    }
});
module.exports =router;