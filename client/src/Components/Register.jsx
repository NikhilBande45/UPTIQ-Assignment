import React, { useState } from 'react'
import base64 from 'base64-js';
import nacl from 'tweetnacl';
import axios from 'axios';
const Register = () => {
    const [data,setData]=useState({
        Name:"",
        Email:"",
        Password:"",
        publicKey:""
    })
const keyPair = nacl.box.keyPair();

const publicKey = base64.fromByteArray(keyPair.publicKey);
const privateKey = base64.fromByteArray(keyPair.secretKey);
const nonce = nacl.randomBytes(nacl.box.nonceLength);
const handleInputChange=(e)=>{
    e.preventDefault();
  
    setData({...data,[e.target.name]:e.target.value,publicKey:publicKey.toString()})
}
const handleSubmitForm=async ()=>{
    // console.log(typeof (publicKey));
    
    const publicKeyByteArray = base64.toByteArray(publicKey);
const privateKeyByteArray = base64.toByteArray(privateKey);
// console.log(privateKeyByteArray);
// console.log(publicKeyByteArray);


    console.log(data);
     alert(privateKey)
    //  const myForm = new FormData();
    //  myForm.append('Name', data.username);
    //  myForm.append('Email', data.email);
    //  myForm.append('Password', data.password);
    //  myForm.append('publicKey', data.PublicKey);
     
     
     
    
     const reg_data=await axios.post('http://localhost:8000/api/user/signup',data) 
     console.log(reg_data);
     if(reg_data.status===200){
        alert("Signup Successfully")
     }
     
    sessionStorage.setItem('private:',privateKey.toString());
        
    }
  return (
    <div className='flex flex-col justify-center items-center h-screen gap-4 text-xl '>
       <div className='h-[60%] border w-[40%] p-4'>

        <h2 className='text-3xl text-center'>User Registration</h2>
        <form className='flex flex-col gap-4 pt-4' >
            <div className='flex flex-col gap-2'>

            <label htmlFor="Name">
            Enter UserName
            </label>
            <input type='text' name='Name' id='username' 
            className='border border-black'
            placeholder='Enter Username'
            onChange={handleInputChange}
            />
            </div>
            <div className='flex flex-col gap-2'>

                <label htmlFor='Email' >
                Enter Email
            </label>

            <input type='email' name='Email' id='email'
            className='border border-black'
            placeholder='Enter Email'
            onChange={handleInputChange}
            />
            </div>
            <div className='flex flex-col gap-2'>

            <label htmlFor='Password'>
            Enter Password
            </label>
            <input type='password' name='Password' id='password'
            className='border border-black'
            placeholder='Enter Password'
            onChange={handleInputChange}
            />
            </div>
        </form>
            <button  onClick={handleSubmitForm} className='bg-blue-500 text-white'>submit</button>
       </div>
    </div>
  )
}

export default Register