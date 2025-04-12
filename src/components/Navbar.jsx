import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdMenu, MdClose } from 'react-icons/md'; // Ensure these icons are installed

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2" unoptimized>
  <img src="/public/logo2.png" alt="Cyberbloom" className="logo" />

  
</div>


        {/* Desktop Menu */}
       

        {/* Mobile Menu Button */}
        <div className="mobile-menu lg:hidden">
          <button
            onClick={toggleMenu}
            className="inline-flex items-center justify-center p-2 rounded-md hover:text-gray-300 hover:bg-gray-700"
            aria-label="Toggle menu"
          >
            {!isMenuOpen ? (
              <MdMenu className="block h-6 w-6 text-white" />
            ) : (
              <MdClose className="block h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu-items lg:hidden">
          <Link to="/quiz" className="block px-3 py-2 rounded-md hover:bg-gray-700 text-white">Quiz</Link>
          <Link to="/report" className="block px-3 py-2 rounded-md hover:bg-gray-700 text-white">Report</Link>
          <Link to="/login" className="block px-3 py-2 rounded-md hover:bg-gray-700 text-white">Logout</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
