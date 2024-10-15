import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db, auth } from "./Auth/firebase";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { nanoid } from "nanoid";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";
import MobileNavbar from "./MobileNavabr";
import { motion } from "framer-motion";
import { FiImage, FiHash, FiType, FiAlignLeft, FiSend } from "react-icons/fi";

const Createpost = () => {
  const [user, loading] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [hastag, setHastag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const addData = async () => {
    try {
      setSubmitting(true);
      await addDoc(collection(db, "sposts"), {
        postId: nanoid(),
        title,
        post,
        ipost: image,
        uid: user.uid,
        name: user.displayName,
        photo: user.photoURL,
        hastags: hastag,
        likes: 0,
        timestamp: new Date(),
      });
      setSubmitting(false);
      navigate("/");
    } catch (error) {
      console.error("Error adding post:", error);
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <ClipLoader color="purple" loading={loading} size={120} />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <h1 className="text-3xl font-semibold">Login to access</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="hidden lg:block">
        <Leftslidbar />
      </div>
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
      <div className="pt-4 lg:pt-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto bg-[#0A0A0D] rounded-lg shadow-xl overflow-hidden"
        >
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold mb-6 text-white text-center">Create Post</h1>
            <div className="space-y-6">
              <div className="relative">
                <FiType className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Your post Title"
                  className="w-full p-3 pl-10 bg-[#1A1A1D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <FiImage className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter Your post Image URL"
                  className="w-full p-3 pl-10 bg-[#1A1A1D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <FiHash className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  value={hastag}
                  onChange={(e) => setHastag(e.target.value)}
                  placeholder="Enter Your post Hashtags"
                  className="w-full p-3 pl-10 bg-[#1A1A1D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="relative">
                <FiAlignLeft className="absolute top-3 left-3 text-gray-400" />
                <textarea
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  placeholder="Enter post captions"
                  className="w-full p-3 pl-10 bg-[#1A1A1D] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  rows="4"
                />
              </div>
              <button
                className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-4 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                onClick={addData}
                disabled={submitting}
              >
                {submitting ? (
                  <ClipLoader color="white" size={24} />
                ) : (
                  <>
                    <FiSend className="inline-block mr-2" />
                    Submit Post
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Createpost;
