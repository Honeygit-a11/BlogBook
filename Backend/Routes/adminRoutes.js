const express =  require("express");
const router = express.Router();
const User = require("../models/User");
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

module.exports = router;