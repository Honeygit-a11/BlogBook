const express =  require("express");
const router = express.Router();
const User = require("../models/User");
const AuthorRequest = require("../models/AuthorRequest");
const {verifyToken,isAdmin} = require("../middleware/authmiddleware");

router.use(verifyToken,isAdmin);
// admin cann get all the user
router.get("/users", async (req, res) => {
    try {
        const users = await User.find().select("-password");
        res.json({users});
    } catch (error) {
        res.status(500).json({ message:"error fetching users", error: error.message });
    }
});

// delete a user it can only deletd by admin
router.delete("/users/:id", async (req, res)=>{
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).json({ message:"user not found"});

        }
        res.json({message:"User deleted successfully"});
    }catch(error){
        res.status(500).json({message:"Error deleting user", error:error.message});
    }
});

// Get all pending author requests
router.get("/author-requests", async (req, res) => {
    try {
        const requests = await AuthorRequest.find({ status: 'pending' }).populate('userId', 'username email');
        res.json({ requests });
    } catch (error) {
        res.status(500).json({ message: "Error fetching author requests", error: error.message });
    }
});

// Approve author request
router.put("/author-requests/:id/approve", async (req, res) => {
    try {
        const request = await AuthorRequest.findById(req.params.id);
        if (!request) {
            return res.status(404).json({ message: "Author request not found" });
        }

        if (request.status !== 'pending') {
            return res.status(400).json({ message: "Request is not pending" });
        }

        // Update user role to 'author'
        await User.findByIdAndUpdate(request.userId, { role: 'author' });

        // Update request status
        request.status = 'approved';
        request.reviewedAt = new Date();
        request.reviewedBy = req.user.id;
        await request.save();

        res.json({ message: "Author request approved successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error approving author request", error: error.message });
    }
});

module.exports = router;
