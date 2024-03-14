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
import { Cross } from "react-flaticons";
import { motion } from "framer-motion";
import MobileNavbar from "./MobileNavabr";

const Profile = () => {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [submitting] = useState(false);

  const deleteBlogPost = async (postId) => {
    try {
      const postRef = doc(db, "sposts", postId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post: ", error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error.message);
    }
  };

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

      return () => unsubscribe(); // Cleanup the listener when the component unmounts
    }
  };

  useEffect(() => {
    showData();
  }, [user]); // Include user in the dependency array to re-run the effect when the user changes

  if (loading) {
    return (
      <>
        <div className="phone:hidden mid:hidden mac:hidden">
          <Leftslidbar />
        </div>
        <div className="flex items-center justify-center h-screen bg-black">
          <ClipLoader
            color="purple"
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
    <div className="min-h-screen bg-black">
      {user ? (
        <>
          <div className="flex flex-col items-center phone:hidden mac:hidden mid:hidden">
            <Leftslidbar />
          </div>
          <div className="xl:hidden">
            <MobileNavbar />
          </div>
          <div className="flex flex-col justify-center items-center text-white mt-10">
            <img
              src={user.photoURL}
              alt="Profile"
              className="rounded-full"
              height={100}
              width={100}
            />
            <h1 className="mt-10">Name: {user.displayName}</h1>
            <h1 className="mt-2">Email: {user.email}</h1>
            <h1 className="text-white text-5xl mt-20">Posts</h1>
          </div>
          <div className="flex justify-center items-center flex-col mt-20 mb-20 ">
            <button
              className="bg-purple-500 rounded-lg py-2 px-4 absolute right-0 top-0 phone:mt-40 phone:mr-5 cursor-pointer text-white md:hidden mid:hidden sm:hidden lg:hidden xl:hidden"
              onClick={handleLogout}
            >
              Logout
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
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
                        <button
                          className="rounded-full p-1 ml-2"
                          onClick={() => deleteBlogPost(data.id)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <Cross />
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

                    <div className="flex items-center justify-between text-gray-500">
                      <div className="flex items-center space-x-2"></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <button
            className="bg-purple-500 rounded-lg py-2 px-4 absolute top-4 right-4 cursor-pointer text-white phone:hidden mac:mt-20 mac:mr-5"
            onClick={handleLogout}
          >
            Logout
          </button>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
