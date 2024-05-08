require('dotenv').config();
const express=require('express');
const ConnectToMongo=require('./db');
const UserRoute=require('./Routers/UserRouter');
const cors=require('cors')
const PORT=process.env.PORT;
const MONGO_URI=process.env.MONGO_URI;
const app=express();
app.use(cors())

ConnectToMongo(MONGO_URI);

app.use(express.json());
app.use('/api/user',UserRoute);
app.use('/api/document',require("./Routers/DocumentRouter"));

app.listen(PORT,()=>{
    console.log(`Server started on:${PORT}`);
})