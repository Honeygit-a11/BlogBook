const jwt = require("jsonwebtoken");

exports.verifyToken = (req,res,next) =>{
    const token = req.header("Authorization")?.split(" ")[1];
    if(!token) {return res.status(401).json({message:"access denied"});
    }
    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(error){
        res.status(400).json({message:"Invalid token"})
    }
};

exports.isAdmin = (req, res, next) => {
    // This assumes verifyToken has run successfully and req.user is populated.
    
    // Check if the user is present AND the role is 'admin'
    if (req.user && req.user.role === 'admin') {
        next(); // User is an admin, proceed to the route handler
    } else {
        // User is authenticated but not an admin, or the role is missing/incorrect
        return res.status(403).json({ 
            message: 'Forbidden. Administrator privileges required.' 
        });
    }
};