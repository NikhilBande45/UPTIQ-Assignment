const express=require('express');
const router=express.Router();
const {handleUserSignup,handleUserSignin}=require('../Controllers/UserController');

router.route('/signup').post(handleUserSignup);
router.route('/signin').post(handleUserSignin);

module.exports=router;