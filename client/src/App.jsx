import React from 'react';
import { BrowserRouter , Routes, Route } from 'react-router-dom';
import Register from './Components/Register';
import Login from './Components/Login';
import UploadDoc from './Components/UploadDoc';
import Doc from './Components/Doc';
import UserAllow from './Components/UserAllow';
import Navbar from './Components/Navbar';

const FileEncryptor = () => {
  return (
    <>
    <BrowserRouter>
  <Navbar/>
      

    <Routes>
    
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/upload" element={<UploadDoc/>} />
        <Route path="/doc" element={<Doc/>} />
        <Route path="/userAllow/:id" element={<UserAllow/>} />
     
    </Routes>
    </BrowserRouter>
    </>
  );
};

export default FileEncryptor;
