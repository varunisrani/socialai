import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Components/Auth/firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";

import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import MobileNavbar from "./MobileNavabr";

const UserProfile = () => {
  const { _id } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [submitting] = useState(false);

  const showUserData = () => {
    if (_id) {
      const userRef = query(collection(db, "users"), where("uid", "==", _id));
      // Assuming _id is the user document ID

      const unsubscribe = onSnapshot(userRef, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists()) {
            setUserData(doc.data());
          } else {
            console.error("User not found");
          }
        });
      });

      return () => unsubscribe(); // Cleanup the listener when the component unmounts
    }
  };

  const showData = () => {
    const dataRef = collection(db, "sposts");
    const q = query(dataRef, where("uid", "==", _id));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const postsArray = [];
      querySnapshot.forEach((doc) => {
        postsArray.push({ id: doc.id, ...doc.data() });
      });

      setPosts(postsArray);
    });

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  };

  useEffect(() => {
    showUserData();
    showData();
  }, [_id]); // Include _id in the dependency array to re-run the effect when _id changes

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
    <div className="min-h-screen bg-black ">
      {user && userData ? (
        <>
          <div className="flex flex-col items-center phone:hidden mac:hidden">
            <Leftslidbar />
          </div>
          <div className="xl:hidden">
            <MobileNavbar />
          </div>
          <div className="flex flex-col justify-center items-center text-white mt-10">
            <img
              src={userData.photoURL}
              alt="Profile"
              className="rounded-full"
              height={100}
              width={100}
            />
            <h1 className="mt-10">Name: {userData.displayName}</h1>
            <h1 className="mt-2">Email: {userData.email}</h1>
            <h1 className="text-white text-5xl mt-20">Posts</h1>
          </div>
          <div className="flex justify-center items-center flex-col mt-20 mb-20 ">
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
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default UserProfile;
