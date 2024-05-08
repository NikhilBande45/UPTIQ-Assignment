import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/login" className="text-white font-bold">Login</Link>
        <Link to="/register" className="text-white font-bold">Register</Link>
        <Link to="/upload" className="text-white font-bold">Upload Document</Link>
        <Link to="/doc" className="text-white font-bold">View Documents</Link>
        <Link to="/userAllow" className="text-white font-bold">User Allow</Link>
      </div>
    </nav>
  );
};

export default Navbar;
