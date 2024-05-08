import React, { useEffect, useState } from 'react';
import {  useNavigate } from 'react-router-dom'; // Import useHistory hook from react-router-dom
import axios from 'axios';

const Doc = () => {
    const [fetchData, setFetchData] = useState([]);
    const [isAccess,setIsAccess]=useState(false)
   const accessUsers=async(id)=>{
    try{
      const users=await axios.get(`http://localhost:8000/api/document/allowedUsers/${id}`,{
        headers:{
          "authToken": sessionStorage.getItem('token')
        }
      })

      console.log(users.data);
      
    }
    catch(error){
      console.error('Error:', error);
      
    }
   }
    const getAllDocs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/document/doc', {
                headers: {
                    "authToken": sessionStorage.getItem('token')
                }
            });
            console.log(response.data);
            setFetchData(response.data.documents);
        } catch (error) {
            console.error('Error:', error);
        }
    };
    useEffect(()=>{
      getAllDocs()
    },[])
  const navigate=useNavigate()
  
    const navigateToNewComponent = (fileId) => {
        navigate(`/userAllow/${fileId}`); 
    };

    return (
        <div className="container mx-auto">
            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-4" onClick={getAllDocs}>Get Data</button> */}
            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Owner Name</th>
                        <th className="border border-gray-400 px-4 py-2">Owner Email</th>
                        <th className="border border-gray-400 px-4 py-2">File Name</th>
                        <th className="border border-gray-400 px-4 py-2">Accessible Users</th>
                        <th className="border border-gray-400 px-4 py-2">Send File</th>
                    </tr>
                </thead>
                <tbody>
                    {fetchData &&fetchData.map((file, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 px-4 py-2">{file.Owner.Name}</td>
                            <td className="border border-gray-400 px-4 py-2">{file.Owner.Email}</td>
                            <td className="border border-gray-400 px-4 py-2">{file.Filepath}</td>
                            <td className="border border-gray-400 px-4 py-2" onClick={()=>accessUsers(file._id)}>
                                {file.AccessibleUsers && file.AccessibleUsers.map((user, index) => (
                                    <p  key={index}>{user.id}</p>
                                ))}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                             
                                <div className="text-blue-500 cursor-pointer" onClick={() => navigateToNewComponent(file._id)}>Send</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Doc;
