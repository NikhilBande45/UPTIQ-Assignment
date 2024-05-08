const UserModel=require('../Models/UserModel');
const crypto = require('crypto');
const {generateToken}=require('../Services/authServices');
const bcrypt=require("bcryptjs");

const handleUserSignup=async(req,res)=>{
    try {
        const {Name,Email,Password,publicKey}=req.body;
        let user=await UserModel.findOne({Email});
        if(user){
            return res.status(409).json({status:"Failed",message:"Email already registered"});
        }
        const hashedPassword = await bcrypt.hash(Password, 10);
        await UserModel.create({
            Name,
            Email,
            Password:hashedPassword,
            publicKey
        })
        return res.json({status:"Ok", message:"User registeration Successfull"});
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"Failed",message:"Internal Server Error"});
    }
}

const handleUserSignin=async(req,res)=>{
    try {
        const {Email,Password}=req.body;
        let user=await UserModel.findOne({Email});
        if(!user){
            return res.status(404).json({status:"Failed",message:"User with specified email does not exist"});
        }
        const result=await bcrypt.compare(Password,user.Password);
        if(!result){
            return res.status(401).json({status:"Failed",message:"Invalid credentials"});
        }
        const authToken=generateToken({_id:user._id,Name:user.Name,Email:user.Email});
        return res.json({status:"OK", authToken});
        
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({status:"Failed",message:"Internal Server Error"});
    }
}
module.exports={handleUserSignup,handleUserSignin};