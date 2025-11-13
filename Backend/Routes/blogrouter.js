const express =require("express");
const router = express.Router();
const Blog = require("../models/Blog");
const { verifyToken ,isAdmin} = require("../middleware/authmiddleware")

// create a blog
router.post("/create", verifyToken, async (req, res) => {
    try {
        
        // author should come from authenticated user
        const blog = new Blog({ ...req.body, author: req.user.id });
        await blog.save();
        return res.status(201).json(blog);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});


// get all blogs
router.get("/",async(req,res)=>{
    try{
    const blogs = await Blog.find().populate("author","username email role");
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

// get blogs by category
router.get("/category/:category", async (req, res) => {
    try {
        const { category } = req.params;
        const blogs = await Blog.find({ category: { $regex: new RegExp(category, 'i') } }).populate("author", "username email role");
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
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

// like a blog
router.post("/:id/like", verifyToken, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const userId = req.user.id;
        const isLiked = blog.likes.includes(userId);

        if (isLiked) {
            blog.likes = blog.likes.filter(id => id.toString() !== userId);
        } else {
            blog.likes.push(userId);
        }

        await blog.save();
        res.json({ likes: blog.likes.length, isLiked: !isLiked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// add comment to blog
router.post("/:id/comment", verifyToken, async (req, res) => {
    try {
        const { text } = req.body;
        if (!text) return res.status(400).json({ message: "Comment text is required" });

        const blog = await Blog.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        const comment = {
            user: req.user.id,
            text,
            createdAt: new Date()
        };

        blog.comments.push(comment);
        await blog.save();

        // Populate the comment user
        await blog.populate('comments.user', 'username');
        const newComment = blog.comments[blog.comments.length - 1];

        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get comments for a blog
router.get("/:id/comments", async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('comments.user', 'username');
        if (!blog) return res.status(404).json({ message: "Blog not found" });

        res.json(blog.comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get blogs by author
router.get("/author/:authorId", async (req, res) => {
    try {
        const blogs = await Blog.find({ author: req.params.authorId }).populate("author", "username email role");
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports =router;
