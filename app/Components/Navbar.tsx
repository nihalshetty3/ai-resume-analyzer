import React from "react";
import { Link } from "react-router-dom"; // ✅ fixed

const Navbar: React.FC = () => {
  return (
    <nav className="navbar flex justify-between items-center px-6 py-4">
      <Link to="/">
        <p className="text-2xl font-bold text-gradient">RESUMIND</p>
      </Link>

      <Link to="/upload" className="primary-button w-fit">
        Upload Resume
      </Link>
    </nav>
  );
};

export default Navbar;
