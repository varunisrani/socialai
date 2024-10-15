import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotLoggedIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-black flex flex-col justify-center items-center px-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">Welcome to Social AI</h1>
        <p className="text-xl md:text-2xl text-purple-200 mb-12">Connect, Share, and Explore with AI-powered social networking</p>
        <div>
          <Link to="/signin" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full transition duration-300">
            Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default NotLoggedIn;
