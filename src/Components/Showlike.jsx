import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc as firestoreDoc,
} from "firebase/firestore";
import { auth, db } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";
import MobileNavbar from "./MobileNavabr";
import { motion } from "framer-motion";
import NotLoggedIn from "./NotLoggedIn";

const ShowLike = () => {
  const [user, loading] = useAuthState(auth);
  const [likedPosts, setLikedPosts] = useState([]);
  const [submitting] = useState(false);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const likedRef = collection(db, "liked");
        const queryLiked = query(likedRef, where("userId", "==", user.uid));
        const likedSnapshot = await getDocs(queryLiked);

        const uniquePostIds = new Set();
        const likedPostsArray = [];

        for (const doc of likedSnapshot.docs) {
          const likedData = doc.data();
          const postId = likedData.postId;

          if (!uniquePostIds.has(postId)) {
            uniquePostIds.add(postId);

            const postRef = firestoreDoc(db, "sposts", postId);
            const postDoc = await getDoc(postRef);

            if (postDoc.exists()) {
              likedPostsArray.push({ id: postDoc.id, ...postDoc.data() });
            }
          }
        }

        setLikedPosts(likedPostsArray);
      } catch (error) {
        console.error("Error fetching liked posts: ", error.message);
      }
    };

    if (user) {
      fetchLikedPosts();
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
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">
              Posts Liked by {user.displayName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {likedPosts.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#0A0A0D] rounded-lg shadow-lg overflow-hidden"
                >
                  <img
                    src={data.ipost}
                    className="w-full h-48 object-cover"
                    alt="Post"
                  />
                  <div className="p-4">
                    <h2 className="text-xl font-bold mb-2 text-white">
                      {data.title}
                    </h2>
                    <p className="text-gray-300 text-sm mb-4">{data.post}</p>
                    <div className="flex items-center justify-between text-sm text-gray-400">
                      <span>{data.hastags}</span>
                      <span>Likes: {data.likes}</span>
                    </div>
                    <div className="flex items-center mt-4">
                      <img
                        src={data.photo}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-white">{data.name}</span>
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

export default ShowLike;
