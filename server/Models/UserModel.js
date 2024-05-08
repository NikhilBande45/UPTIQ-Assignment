const mongoose=require('mongoose');
const {Schema}=mongoose;

const UserModel=new Schema({
    Name:{
        type:String,
        required:true
    },
    Email:{
        type:String,
        required:true,
        unique:true
    },
    Password:{
        type:String,
        required:true
    },
    publicKey:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model("User",UserModel);