import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Components/Auth/firebase"; // Adjust the path accordingly
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";
import { FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";
import MobileNavbar from "./MobileNavabr";
import NotLoggedIn from "./NotLoggedIn";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const deleteBlogPost = async (postId) => {
    try {
      setSubmitting(true);
      const postRef = doc(db, "sposts", postId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post: ", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

  useEffect(() => {
    const showData = () => {
      if (user) {
        const dataRef = collection(db, "sposts");
        const q = query(dataRef, where("uid", "==", user.uid));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const postsArray = [];
          querySnapshot.forEach((doc) => {
            postsArray.push({ id: doc.id, ...doc.data() });
          });

          setPosts(postsArray);
        });

        return unsubscribe;
      }
    };

    const unsubscribe = showData();
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <ClipLoader color="purple" loading={loading || submitting} size={120} />
      </div>
    );
  }

  if (!user) {
    return <NotLoggedIn />;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="hidden lg:block">
        <Leftslidbar />
      </div>
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
      <div className="pt-4 lg:pt-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <div className="flex flex-col items-center mb-8">
          <img
            src={user.photoURL}
            alt="Profile"
            className="rounded-full w-24 h-24 mb-4"
          />
          <h1 className="text-2xl font-bold">{user.displayName}</h1>
          <p className="text-gray-400">{user.email}</p>
          <button
            className="mt-4 bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded transition duration-200"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">Your Posts</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((data) => (
            <motion.div
              key={data.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0A0A0D] rounded-lg shadow-md overflow-hidden"
            >
              <img
                src={data.ipost}
                alt="Post Image"
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">{data.title}</h3>
                  <button
                    className="text-red-500 hover:text-red-600 transition duration-200"
                    onClick={() => deleteBlogPost(data.id)}
                    disabled={submitting}
                  >
                    <FiTrash2 size={20} />
                  </button>
                </div>
                <p className="text-gray-400 text-sm mb-2">{data.hastags}</p>
                <p className="text-sm">{data.post}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
