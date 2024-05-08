const mongoose=require('mongoose');

const ConnectToMongo=async(MONGO_URL)=>{
    try {
        await mongoose.connect(MONGO_URL);
        console.log('Connected to DB');
    } catch (error) {
        console.log(error.message);
    }
}

module.exports=ConnectToMongo;