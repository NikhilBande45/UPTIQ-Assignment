import React, { useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UserAllow = () => {
    const [email, setEmail] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    
    const sendFile = async () => {
        const data = {
            Email: email,
            secretKey: sessionStorage.getItem("private Key")
        };

        try {
            const response = await axios.post(`http://localhost:8000/api/document/allowedUsers/${id}`, data, {
                headers: {
                    'authToken': sessionStorage.getItem('token')
                }
            });
            console.log(response.data);
            // Navigate to /doc upon successful upload
            navigate('/doc');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center">
            <input 
                className="border border-gray-400 rounded-md py-2 px-4 mb-4"
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="Enter email address" 
            />
            <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={sendFile}
            >
                Send
            </button>
        </div>
    );
};

export default UserAllow;
