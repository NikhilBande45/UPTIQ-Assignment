const { validateToken } = require("../Services/authServices");
const authenticateUser = async (req, res, next) => {
    try {
        const  authToken  = req.header("authToken");
        // console.log(authToken);
        const payload = validateToken(authToken);  //Throws error when token is invalid
        if (!payload) return res.status(401).json({ status: "Failed", message: "Access denied" });
        req.user = payload;
        next();
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({stauts:"Failed",message:"Access denied"});
    }
}

module.exports=authenticateUser;