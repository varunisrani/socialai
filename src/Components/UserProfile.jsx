import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../Components/Auth/firebase";
import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";
import { motion } from "framer-motion";
import { useParams } from "react-router-dom";
import MobileNavbar from "./MobileNavabr";
import NotLoggedIn from "./NotLoggedIn";

const UserProfile = () => {
  const { _id } = useParams();
  const [user, loading] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [posts, setPosts] = useState([]);
  const [submitting] = useState(false);

  useEffect(() => {
    const showUserData = () => {
      if (_id) {
        const userRef = query(collection(db, "users"), where("uid", "==", _id));
        return onSnapshot(userRef, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            if (doc.exists()) {
              setUserData(doc.data());
            } else {
              console.error("User not found");
            }
          });
        });
      }
    };

    const showData = () => {
      const dataRef = collection(db, "sposts");
      const q = query(dataRef, where("uid", "==", _id));
      return onSnapshot(q, (querySnapshot) => {
        const postsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPosts(postsArray);
      });
    };

    const unsubscribeUser = showUserData();
    const unsubscribePosts = showData();

    return () => {
      if (unsubscribeUser) unsubscribeUser();
      if (unsubscribePosts) unsubscribePosts();
    };
  }, [_id]);

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

  if (!userData) {
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <h1 className="text-3xl font-semibold">User not found</h1>
      </div>
    );
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
            src={userData.photoURL}
            alt="Profile"
            className="rounded-full w-24 h-24 mb-4"
          />
          <h1 className="text-2xl font-bold">{userData.displayName}</h1>
          <p className="text-gray-400">{userData.email}</p>
        </div>

        <h2 className="text-3xl font-bold mb-6 text-center">User Posts</h2>

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
                <h3 className="text-lg font-semibold mb-2">{data.title}</h3>
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

export default UserProfile;
