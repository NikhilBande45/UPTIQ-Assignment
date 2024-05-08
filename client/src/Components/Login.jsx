import React, { useState } from "react";
import base64 from "base64-js";
import nacl from "tweetnacl";
import axios from "axios";
const Login = () => {
  const [data, setData] = useState({
   
    Email: "",
    Password: "",
 
  });
  const keyPair = nacl.box.keyPair();
  // console.log(keyPair);
 
  const handleInputChange = (e) => {
    e.preventDefault();
    // setData({...data,})
    setData({
      ...data,
      [e.target.name]: e.target.value,
    
    });
  };
  const handleSubmitForm = async () => {
    console.log(data);
  
  

    const reg_data = await axios.post("http://localhost:8000/api/user/signin", data);
    console.log(reg_data);
    if(reg_data.status===200){
      alert("Login Successfully")
      sessionStorage.setItem('token',reg_data.data.authToken)
    }
    else if(reg_data!==200){
      alert("Invalid Credentials")
    }
    
  };
  const handleSetKay=(e)=>{
    e.preventDefault()
    sessionStorage.setItem("private Key",e.target.value)
  }
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4 text-xl ">
      <div className="h-[60%] border w-[40%] p-4">
        <h2 className="text-3xl text-center">User Login</h2>
        <form className="flex flex-col gap-4 pt-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="email">Enter Email</label>

            <input
              type="email"
              name="Email"
              id="Email"
              className="border border-black"
              placeholder="Enter Email"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="password">Enter Password</label>
            <input
              type="password"
              name="Password"
              id="Password"
              className="border border-black"
              placeholder="Enter Password"
              onChange={handleInputChange}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="key">Enter Password</label>
            <input
              type="password"
              name="kay"
              id="kay"
              className="border border-black"
              placeholder="Enter Key"
              onChange={handleSetKay}
            />
          </div>
          
        </form>
        <button onClick={handleSubmitForm} className="bg-blue-500 text-white">
          submit
        </button>
      </div>
    </div>
  );
};

export default Login;
