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

const ShowLike = () => {
  const [user, loading] = useAuthState(auth);
  const [likedPosts, setLikedPosts] = useState([]);
  const [submitting] = useState(false);
  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        // Fetch liked posts from the "liked" collection for the current user
        const likedRef = collection(db, "liked");
        const queryLiked = query(likedRef, where("userId", "==", user.uid));
        const likedSnapshot = await getDocs(queryLiked);

        // Fetch details of each liked post from the "sposts" collection
        const uniquePostIds = new Set(); // To store unique post IDs
        const likedPostsArray = [];

        for (const doc of likedSnapshot.docs) {
          const likedData = doc.data();
          const postId = likedData.postId;

          // Check if the post ID is already added
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
      <>
        <Leftslidbar />
        <div className="flex items-center justify-center h-screen bg-black">
          <ClipLoader
            color="purple" // Change color to your preference
            loading={loading || submitting}
            size={120}
            aria-label="Loading Spinner"
            className="ml-10"
            data-testid="loader"
          />
        </div>
      </>
    );
  }
  return (
    <div className="min-h-screen bg-black p-4">
      {user ? (
        <>
          <div className="flex flex-col items-center">
            <Leftslidbar />
          </div>
          <div className="flex flex-col items-center ">
            <h1 className="text-4xl font-bold mt-8 mb-4 text-white">
              Posts Liked by {user.displayName}
            </h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {likedPosts.map((data) => (
                <div
                  key={data.id}
                  className="bg-[#0A0A0D] p-6 rounded-lg shadow-lg mb-8 "
                >
                  <img
                    src={data.ipost}
                    className="mt-4 rounded-lg"
                    alt="Post"
                  />
                  <h1 className="text-2xl font-bold mb-4 mt-4 text-white">
                    {data.title}
                  </h1>
                  <p className="text-white">{data.post}</p>
                  <h1 className="mt-3 text-white/50">
                    {data.hastags} Likes {data.likes}
                  </h1>
                  <div className="flex items-center mt-4">
                    <img
                      src={data.photo}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <span className="text-white">{data.name}</span>
                  </div>
                </div>
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

export default ShowLike;
