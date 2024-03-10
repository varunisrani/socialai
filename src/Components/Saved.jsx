import { useState, useEffect } from "react";
import { Bookmark, Heart } from "react-flaticons";
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

const ShowSaved = () => {
  const [user] = useAuthState(auth);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        // Fetch saved posts from the "saved" collection for the current user
        const savedRef = collection(db, "saved");
        const querySaved = query(savedRef, where("userId", "==", user.uid));
        const savedSnapshot = await getDocs(querySaved);

        // Fetch details of each saved post from the "sposts" collection
        const uniquePostIds = new Set(); // To store unique post IDs
        const savedPostsArray = [];

        for (const doc of savedSnapshot.docs) {
          const savedData = doc.data();
          const postId = savedData.postId;

          // Check if the post ID is already added
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

  return (
    <div className="min-h-screen bg-black p-4">
      {user ? (
        <>
          <div className="flex flex-col items-center">
            <Leftslidbar />
          </div>
          <div className="flex flex-col items-center ml-40">
            <h1 className="text-4xl font-bold mt-8 mb-4 text-white">
              Posts Saved by {user.displayName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {savedPosts.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <>
                    <div className="bg-[#0A0A0D] p-10 rounded-lg shadow-md max-w-md">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          <img
                            src={data.photo}
                            alt="User Avatar"
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-white font-semibold">
                              {data.name}
                            </p>
                          </div>
                        </div>
                        <div className="text-gray-500 cursor-pointer">
                          <button className="hover:bg-gray-50 rounded-full p-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              // eslint-disable-next-line react/no-unknown-property
                              stroke-width="2"
                              // eslint-disable-next-line react/no-unknown-property
                              stroke-linecap="round"
                              // eslint-disable-next-line react/no-unknown-property
                              stroke-linejoin="round"
                            >
                              <circle cx="12" cy="7" r="1" />
                              <circle cx="12" cy="12" r="1" />
                              <circle cx="12" cy="17" r="1" />
                            </svg>
                          </button>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-white">
                          {data.title}
                          <div className="flex flex-row gap-2">
                            <a href="" className="text-gray-400">
                              {data.hastags}
                            </a>
                          </div>
                        </p>
                      </div>

                      <div className="mb-4">
                        <img
                          src={data.ipost}
                          alt="Post Image"
                          className="w-full h-48 object-cover rounded-md"
                        />
                      </div>
                    </div>
                  </>
                </motion.div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="flex flex-col justify-center items-center absolute inset-0">
          <button className="bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full">
            <Link to="/signin">Login</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default ShowSaved;