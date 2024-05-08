import React, { useState } from "react";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";
import nacl from 'tweetnacl';
import base64 from 'base64-js';
import axios from "axios";

const UploadDoc = () => {
  const [file, setFile] = useState(null);
  const [file1, setFile1] = useState(null);
  const [nonce, setNonce] = useState(null);
  const [encryptedKey, setEncryptedKey] = useState(""); 

  const handleFileChange = (e) => {
    setFile1(e.target.files[0]);
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setFile(reader.result)
      }
    }
    reader.readAsDataURL(e.target.files[0]);
  };

  const generateSecretKey = () => {
    let str = "";
    for (let i = 0; i < 6; i++) {
      str += Math.round(Math.random() * 9);
    }
    return str;
  };

  const encryptKey = (key) => {
    let user1PrivateKey = "J3f8HYmeYw2/+LkzONZEB1Y5E4jQOwxvYjcyjif5nuM=";
    let user2PublicKey = "FFaA/PJlsqaQIXN0Ts6uCf2TA0OAsRR1ik+/tpjZAhQ=";

    const user1PrivateKeyBytes = base64.toByteArray(user1PrivateKey);
    const user2PublicKeyBytes = base64.toByteArray(user2PublicKey);

    const keyUint8 = new TextEncoder().encode(key);
    const nonceValue = nacl.randomBytes(nacl.box.nonceLength);

    const encryptedData = nacl.box(keyUint8, nonceValue, user2PublicKeyBytes, user1PrivateKeyBytes);

    setNonce(nonceValue);
    setEncryptedKey(encryptedData);
  };

  const encryptFile = async () => {
    try {
      const key = generateSecretKey();
      encryptKey(key);

      const fileContents = await file1.arrayBuffer();
      const wordArray = CryptoJS.lib.WordArray.create(fileContents);

      const encrypted = CryptoJS.AES.encrypt(wordArray, key).toString();

      const encryptedFile = new Blob([encrypted], { type: "text/plain;charset=utf-8" });

      const formData = new FormData();
      formData.append('file', file1);
      formData.append('secretKey', key);

      fetch('http://localhost:8000/api/document/doc', {
        method: 'POST',
        body: formData,
        headers:{
          'authToken':sessionStorage.getItem('token')
        }
      }).then((res)=>{
        console.log(res.data);
      }).catch((err)=>{
        console.log(err);
      })

      saveAs(encryptedFile, `${file.name}`);
    } catch (error) {
      console.error("Error encrypting and uploading file:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <input type="file" onChange={handleFileChange} />
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4" onClick={encryptFile}>Upload File</button>
    </div>
  );
};

export default UploadDoc;
