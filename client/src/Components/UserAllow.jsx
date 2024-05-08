import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserAllow = () => {
    const [email, setEmail] = useState('');
    const {id}=useParams()
   
    
    const sendFile = async () => {
        const data = {
            Email: email,
            secretKey: '140318'
        };

        try {
            const response = await axios.post(`http://localhost:8000/api/document/allowedUsers/${id}`, data, {
                headers: {
                    'authToken': sessionStorage.getItem('token')
                }
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
            <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email address" 
            />
            <button onClick={sendFile}>User Allow</button>
        </div>
    );
};

export default UserAllow;
