import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Add, Bookmark, Heart, Home, PhotoVideo, User } from "react-flaticons";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { auth } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth"; // Import useAuthState

const MenuItem = ({ to, icon: Icon, label, isActive, isCollapsed }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (isCollapsed) {
      e.preventDefault();
      navigate(to);
    }
  };

  return (
    <Link to={to} onClick={handleClick}>
      <span className={`select-none flex items-center px-4 py-3 my-1 rounded-lg transition-all duration-300 ease-in-out ${isActive ? 'bg-gradient-to-r from-purple-500 to-purple-800 text-white' : 'text-gray-400 hover:bg-purple-500/10 hover:text-white'}`}>
        <Icon size="20px" />
        {!isCollapsed && <span className="ml-3 text-sm font-medium">{label}</span>}
      </span>
    </Link>
  );
};

const Leftslidbar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, loading] = useAuthState(auth); // Ensure user state is fetched
  const location = useLocation();

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);
  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  return (
    <div className={`bg-[#0A0A0D] fixed z-40 inset-y-0 left-0 transition-all duration-300 ease-in-out ${isCollapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex flex-col h-full">
        {/* Logo and toggle button */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          {!isCollapsed && (
            <Link to="/" className="flex items-center">
              <img
                alt="Logo"
                src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/logos/loopple.svg"
                className="h-8 w-8"
              />
              <h1 className="ml-3 font-medium text-white text-xl">Social AI</h1>
            </Link>
          )}
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-full hover:bg-gray-700 text-gray-400 hover:text-white"
          >
            {isCollapsed ? <FaChevronRight size={20} /> : <FaChevronLeft size={20} />}
          </button>
        </div>

        {/* Navigation menu */}
        <nav className="flex-1 overflow-y-auto py-4">
          <div className="px-3 mb-6">
            {!isCollapsed && <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Main</h2>}
            <MenuItem to="/" icon={Home} label="Home" isActive={location.pathname === '/'} isCollapsed={isCollapsed} />
            <MenuItem to="/search" icon={PhotoVideo} label="Explore" isActive={location.pathname === '/search'} isCollapsed={isCollapsed} />
            <MenuItem to="/people" icon={User} label="People" isActive={location.pathname === '/people'} isCollapsed={isCollapsed} />
          </div>

          <div className="px-3 mb-6">
            {!isCollapsed && <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Personal</h2>}
            <MenuItem to="/save" icon={Bookmark} label="Saved" isActive={location.pathname === '/save'} isCollapsed={isCollapsed} />
            <MenuItem to="/youlike" icon={Heart} label="Liked Posts" isActive={location.pathname === '/youlike'} isCollapsed={isCollapsed} />
            <MenuItem to="/cpost" icon={Add} label="Create Post" isActive={location.pathname === '/cpost'} isCollapsed={isCollapsed} />
            <MenuItem to="/profile" icon={User} label="Profile" isActive={location.pathname === '/profile'} isCollapsed={isCollapsed} />
          </div>
        </nav>

        {/* Logout button */}
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-400 hover:bg-purple-500/10 hover:text-white rounded-lg transition-colors duration-200" onClick={handleLogout}>
            <FiLogOut size={20} />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Leftslidbar;
