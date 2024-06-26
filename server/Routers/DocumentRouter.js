const express=require('express');
const router=express.Router();
const authenticateUser=require('../Middleware/Authentication');
const {handleAddAllowedUser,handleGetAllowedUsers,handleGetDocument,handleNewDocument,handleGetAllDocuments,handleUpdateDocument,handleDeleteAllowedUser, handleDownloadDocument}=require("../Controllers/DocumentController");
const multer=require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // console.log(file);
        return cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        return cb(null, `${Date.now()}-${file.originalname}`)
    }
})
    
const upload = multer({ storage: storage });

router.route('/doc').get(authenticateUser,handleGetAllDocuments).post(authenticateUser,upload.single('file'),handleNewDocument);

router.route('/handleDocument/:id').get(authenticateUser,handleGetDocument).put(authenticateUser,handleUpdateDocument)

router.route('/allowedUsers/:id').get(authenticateUser,handleGetAllowedUsers).post(authenticateUser,handleAddAllowedUser).delete(authenticateUser,handleDeleteAllowedUser);

router.route('/download/:id').get( authenticateUser, handleDownloadDocument);

module.exports=router;