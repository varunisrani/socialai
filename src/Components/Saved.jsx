import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { motion } from "framer-motion";
import { auth, db } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";
import MobileNavbar from "./MobileNavabr";
import NotLoggedIn from "./NotLoggedIn";

const ShowSaved = () => {
  const [user, loading] = useAuthState(auth);
  const [savedPosts, setSavedPosts] = useState([]);
  const [submitting] = useState(false);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const savedRef = collection(db, "saved");
        const querySaved = query(savedRef, where("userId", "==", user.uid));
        const savedSnapshot = await getDocs(querySaved);

        const uniquePostIds = new Set();
        const savedPostsArray = [];

        for (const doc of savedSnapshot.docs) {
          const savedData = doc.data();
          const postId = savedData.postId;

          if (!uniquePostIds.has(postId)) {
            uniquePostIds.add(postId);

            const postRef = firestoreDoc(db, "sposts", postId);
            const postDoc = await getDoc(postRef);

            if (postDoc.exists()) {
              savedPostsArray.push({ id: postDoc.id, ...postDoc.data() });
            }
          }
        }

        setSavedPosts(savedPostsArray);
      } catch (error) {
        console.error("Error fetching saved posts: ", error.message);
      }
    };

    if (user) {
      fetchSavedPosts();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <ClipLoader
          color="purple"
          loading={loading || submitting}
          size={120}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    );
  }

  if (!user) {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-black">
      {user ? (
        <>
          <div className="hidden lg:block">
            <Leftslidbar />
          </div>
          <div className="lg:hidden">
            <MobileNavbar />
          </div>
          <div className="pt-4 lg:pt-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center lg:text-left">
              Posts Saved by {user.displayName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedPosts.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#0A0A0D] rounded-lg shadow-md overflow-hidden"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src={data.photo}
                          alt="User Avatar"
                          className="w-8 h-8 rounded-full"
                        />
                        <p className="text-white font-semibold">{data.name}</p>
                      </div>
                      <button className="text-gray-500 hover:text-gray-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="mb-4">
                      <img
                        src={data.ipost}
                        alt="Post Image"
                        className="w-full h-48 object-cover rounded-md"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium mb-2">{data.title}</p>
                      <p className="text-gray-400 text-sm">{data.hastags}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center h-screen">
          <button className="bg-white shadow-xl text-blue-700 font-bold px-6 py-3 rounded-full text-lg">
            <Link to="/signin">Login</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowSaved;
