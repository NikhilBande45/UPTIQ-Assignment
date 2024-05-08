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
  const [encryptedKey, setEncryptedKey] = useState(""); // Store encrypted key

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

  const decryptKey = () => {
    if (!encryptedKey || !nonce) {
      console.error("Encrypted key or nonce is missing");
      return;
    }
    let user2PrivateKey = "vMqKh6H3A0tXRKwg2zjI9UAFX34LZ4AG199pNW8PCoo=";
    let user1publicKey = "djJatExRr24qsL9v6KXRI565uaHXctI6+/0n7t1eDiw=";

    const user2PrivateKeyBytes = base64.toByteArray(user2PrivateKey);
    const user1publicKeyBytes = base64.toByteArray(user1publicKey);

    const nonceValue = nacl.randomBytes(nacl.box.nonceLength);

    const decryptedData = nacl.box.open(encryptedKey, nonceValue, user1publicKeyBytes, user2PrivateKeyBytes);

    if (!decryptedData) {
      console.error("Failed to decrypt the key");
      return null;
    }

    const decryptedKey = new TextDecoder().decode(decryptedData);
    return decryptedKey;
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
      formData.append('file', file);
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

  const decryptFile = async () => {
    const key = decryptKey()
    try {
      const fileContents = await file.text();
      const decrypted = CryptoJS.AES.decrypt(fileContents, key);
      const decryptedData = decrypted.toString(CryptoJS.enc.Latin1);
      const decryptedFile = new Blob(
        [decryptedData.toString(CryptoJS.enc.Uint8Array)],
        { type: file.type }
      );
      saveAs(decryptedFile, `${file.name.replace(/\.encrypted$/, "")}`);
    } catch (error) {
      console.error("Error decrypting file:", error);
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <input type="file" onChange={handleFileChange} />
      <div className="flex mt-4">
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4" onClick={encryptFile}>Encrypt File</button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={decryptFile}>Decrypt File</button>
      </div>
    </div>
  );
};

export default UploadDoc;
