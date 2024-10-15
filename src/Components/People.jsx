import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Leftslidbar from "./Leftslidbar";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import MobileNavbar from "./MobileNavabr";
import NotLoggedIn from "./NotLoggedIn";

const People = () => {
  const [user, loading] = useAuthState(auth);
  const [users, setUsers] = useState([]);
  const [followerIds, setFollowerIds] = useState([]);
  const [submitting] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, "users");
        const usersSnapshot = await getDocs(usersCollection);
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users: ", error.message);
      }
    };

    const fetchFollowers = async () => {
      if (user) {
        const followQuery = query(
          collection(db, "follow"),
          where("followedbyid", "==", user.uid)
        );
        const followSnapshot = await getDocs(followQuery);
        const followerIds = followSnapshot.docs.map(
          (doc) => doc.data().followertoId
        );
        setFollowerIds(followerIds);
      }
    };

    if (user) {
      fetchUsers();
      fetchFollowers();
    }
  }, [user]);

  const handleFollowToggle = async (userId, userName) => {
    try {
      const followQuery = query(
        collection(db, "follow"),
        where("followedbyid", "==", user.uid),
        where("followertoId", "==", userId)
      );

      const followSnapshot = await getDocs(followQuery);

      if (followSnapshot.empty) {
        await addDoc(collection(db, "follow"), {
          followedbyid: user.uid,
          followedbyName: user.displayName,
          followertoId: userId,
          followertoName: userName,
        });
        setFollowerIds([...followerIds, userId]);
      } else {
        const followId = followSnapshot.docs[0].id;
        await deleteDoc(doc(db, "follow", followId));
        setFollowerIds(followerIds.filter((id) => id !== userId));
      }

      alert(
        followSnapshot.empty
          ? "Followed successfully"
          : "Unfollowed successfully"
      );
    } catch (error) {
      console.error("Error handling follow/unfollow: ", error.message);
    }
  };

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
            <h1 className="text-white text-3xl font-bold mb-8">All Users</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {users.map((userData) => (
                <motion.div
                  key={userData.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-[#0A0A0D] text-white p-6 rounded-lg shadow-lg flex flex-col items-center"
                >
                  <Link to={`/peoples/${userData.uid}`}>
                    <img
                      src={userData.photoURL || "/default-profile-image.png"}
                      alt="Profile"
                      className="w-24 h-24 rounded-full mb-4 object-cover"
                    />
                  </Link>
                  <p className="text-lg font-bold mb-1">{userData.displayName}</p>
                  <p className="text-sm text-gray-400 mb-4">{userData.email}</p>
                  <button
                    onClick={() =>
                      handleFollowToggle(userData.id, userData.displayName)
                    }
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
                      followerIds.includes(userData.id)
                        ? "bg-purple-700 hover:bg-purple-800"
                        : "bg-purple-500 hover:bg-purple-600"
                    }`}
                  >
                    {followerIds.includes(userData.id) ? "Unfollow" : "Follow"}
                  </button>
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

export default People;
