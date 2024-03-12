// People.jsx
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
    <>
      <div className="min-h-screen bg-black p-4">
        {user ? (
          <>
            <div className="flex flex-col items-center">
              <Leftslidbar />
            </div>
            <div className="flex flex-col ml-80 mt-20">
              <h1 className="text-white text-3xl font-bold ml-10">All Users</h1>
            </div>
            <div className="flex flex-wrap gap-8 ml-80">
              {users.map((userData) => (
                <motion.div
                  key={userData.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div
                    key={userData.id}
                    className="bg-[#0A0A0D] text-white p-4 rounded-lg mb-4 w-80 flex flex-col items-center ml-10 mt-20"
                  >
                    <Link to={`/peoples/${userData.uid}`}>
                      <img
                        src={userData.photoURL || "/default-profile-image.png"}
                        alt="Profile"
                        className="w- h-20 rounded-full mb-2"
                      />
                    </Link>
                    <p className="text-lg font-bold">{userData.displayName}</p>
                    <p className="text-sm">{userData.email}</p>
                    <button
                      onClick={() =>
                        handleFollowToggle(userData.id, userData.displayName)
                      }
                      className="p-2 w-20 bg-purple-500 rounded-lg mt-5"
                    >
                      {followerIds.includes(userData.id)
                        ? "Unfollow"
                        : "Follow"}
                    </button>
                  </div>
                </motion.div>
              ))}
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
    </>
  );
};

export default People;
