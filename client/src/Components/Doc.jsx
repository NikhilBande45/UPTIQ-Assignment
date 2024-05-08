import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Doc = () => {
    const [fetchData, setFetchData] = useState([]);
    const [othersData, setOthersData] = useState([]);
    const userId = sessionStorage.getItem("userId");
    const navigate = useNavigate();

    const accessUsers = async (id) => {
        try {
            const users = await axios.get(`http://localhost:8000/api/document/allowedUsers/${id}`, {
                headers: {
                    "authToken": sessionStorage.getItem('token')
                }
            });
            console.log(users.data);
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const getAllDocs = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/document/doc', {
                headers: {
                    "authToken": sessionStorage.getItem('token')
                }
            });
            console.log(response.data);
            setFetchData(response.data.documents);
            setOthersData(response.data.documents.filter(file => file.Owner._id !== userId && file.AccessebleUsers.length > 0 && file.AccessebleUsers.some(user => user.user === userId)));
        } catch (error) {
            console.error('Error:', error);
        }
    };

    useEffect(() => {
        getAllDocs();
    }, []);

    const navigateToNewComponent = (fileId) => {
        navigate(`/userAllow/${fileId}`);
    };

    
  const [documentId, setDocumentId] = useState('');

  const handleDownload = async (id) => {
    try {
    
      const response = await axios.get(`http://localhost:8000/api/document/download/${id}`, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'authToken': sessionStorage.getItem('token'), 
        },
        responseType: 'blob', 
      });

     
      const encryptedFileData = response.data;

     
      const encryptedBlob = new Blob([encryptedFileData], { type: 'application/octet-stream' });
      console.log(response);
      
      
     
      const fileName = response.headers['content-disposition'].split('uploads/')[1] || 'encrypted_file.txt';

      
      const downloadUrl = window.URL.createObjectURL(encryptedBlob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  


    return (
        <div className="container mx-auto">
            <table className="table-auto w-full border-collapse">
                <thead>
                    <tr>
                        <th className="border border-gray-400 px-4 py-2">Owner Name</th>
                        <th className="border border-gray-400 px-4 py-2">Owner Email</th>
                        <th className="border border-gray-400 px-4 py-2">File Name</th>
                        {/* <th className="border border-gray-400 px-4 py-2">Accessible Users</th> */}
                        <th className="border border-gray-400 px-4 py-2">Send File</th>
                        <th className="border border-gray-400 px-4 py-2">Download</th>
                    </tr>
                </thead>
                <tbody>
                    {fetchData.map((file, index) =>(file.Owner._id===userId  )&& (
                        <tr key={index}>
                            <td className="border border-gray-400 px-4 py-2">{file.Owner.Name}</td>
                            <td className="border border-gray-400 px-4 py-2">{file.Owner.Email}</td>
                            <td className="border border-gray-400 px-4 py-2">{file.Filepath}</td>
                            {/* <td className="border border-gray-400 px-4 py-2" onClick={() => accessUsers(file._id)}>
                                {file.AccessebleUsers.map((user, index) => (
                                    <p key={index}>{user.id}</p>

                                ))}
                            </td> */}
                            <td className="border border-gray-400 px-4 py-2">
                                {file.Owner._id === userId && <div className="text-blue-500 cursor-pointer" onClick={() => navigateToNewComponent(file._id)}>Send</div>}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                <a className="text-blue-500 cursor-pointer" onClick={() => handleDownload(file._id)}>Download</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tbody>
                    {othersData.map((file, index) => (
                        <tr key={index}>
                            <td className="border border-gray-400 px-4 py-2">{file.Owner.Name}</td>
                            <td className="border border-gray-400 px-4 py-2">{file.Owner.Email}</td>
                            <td className="border border-gray-400 px-4 py-2">{file.Filepath}</td>
                            {/* <td className="border border-gray-400 px-4 py-2" onClick={() => accessUsers(file._id)}>
                                {file.AccessebleUsers.map((user, index) => (
                                    <p key={index}>{user.id}</p>
                                ))}
                            </td> */}
                            <td className="border border-gray-400 px-4 py-2">
                                {file.Owner._id === userId ? <div className="text-blue-500 cursor-pointer" onClick={() => navigateToNewComponent(file._id)}>Send</div>:<p>Recieved</p>}
                            </td>
                            <td className="border border-gray-400 px-4 py-2">
                                <div className="text-blue-500 cursor-pointer" onClick={() => handleDownload(file._id)}>Download</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Doc;
