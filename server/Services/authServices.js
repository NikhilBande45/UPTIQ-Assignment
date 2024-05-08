const jwt=require("jsonwebtoken");
const SECRET_KEY="asm75fd54hnd$5F7*4d";
const generateToken=(payload)=>{
    try {
        const authToken=jwt.sign(payload,SECRET_KEY);
        return authToken;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

const validateToken=(authToken)=>{
    try {
        const user=jwt.verify(authToken,SECRET_KEY);
        return user;
    } catch (error) {
        console.log(error.message);
        return null;
    }
}

module.exports={generateToken,validateToken};