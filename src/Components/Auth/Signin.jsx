import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link, useNavigate } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import { useState } from "react";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";
import { FiLogIn } from "react-icons/fi";

const Signin = () => {
  const [submitting, setSubmitting] = useState(false);
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  const google = async () => {
    try {
      setSubmitting(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await addUserData(user);
      navigate("/");
    } catch (err) {
      console.log(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const addUserData = async (user) => {
    try {
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        displayName: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
        email: user.email,
      });
      console.log("User data added successfully!");
    } catch (error) {
      console.error("Error adding user data: ", error.message);
    }
  };

  const logout = async () => {
    await auth.signOut();
  };

  if (loading || submitting) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-purple-900 to-black">
        <ClipLoader color="purple" size={120} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-black px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-lg"
      >
        {user ? (
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-extrabold text-white">
              Welcome, {user.displayName}!
            </h2>
            <p className="mt-2 text-sm text-gray-400">You're signed in.</p>
            <div className="mt-8 space-y-4">
              <Link
                to="/"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                Go to Home
              </Link>
              <button
                onClick={logout}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
                Sign in to Social AI
              </h2>
              <p className="mt-2 text-center text-sm text-gray-400">
                Connect, Share, and Explore with AI-powered social networking
              </p>
            </div>
            <div className="mt-8 space-y-6">
              <button
                onClick={google}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <FcGoogle className="w-5 h-5 mr-2" />
                Sign in with Google
              </button>
            
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Signin;
