import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc as firestoreDoc,
  deleteDoc,
  updateDoc,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import ClipLoader from "react-spinners/ClipLoader";
import { auth, db } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";
import Leftslidbar from "./Leftslidbar";
import { Bookmark } from "react-flaticons";
import { FaHeart } from "react-icons/fa";
import MobileNavbar from "./MobileNavabr";
import NotLoggedIn from "./NotLoggedIn";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [submitting] = useState(false);

  useEffect(() => {
    const showData = () => {
      const dataRef = collection(db, "sposts");
      const q = query(dataRef);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const postsArray = [];
        querySnapshot.forEach((doc) => {
          postsArray.push({ id: doc.id, ...doc.data() });
        });

        setPosts(postsArray);
      });

      return () => unsubscribe();
    };

    showData();
  }, []);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        const likedRef = collection(db, "liked");
        const queryLiked = query(likedRef, where("userId", "==", user.uid));
        const likedSnapshot = await getDocs(queryLiked);

        const likedPostsArray = [];
        for (const doc of likedSnapshot.docs) {
          likedPostsArray.push(doc.data().postId);
        }

        setLikedPosts(likedPostsArray);
      } catch (error) {
        console.error("Error fetching liked posts: ", error.message);
      }
    };

    const fetchSavedPosts = async () => {
      try {
        const savedRef = collection(db, "saved");
        const querySaved = query(savedRef, where("userId", "==", user.uid));
        const savedSnapshot = await getDocs(querySaved);

        const savedPostsArray = [];
        for (const doc of savedSnapshot.docs) {
          savedPostsArray.push(doc.data().postId);
        }

        setSavedPosts(savedPostsArray);
      } catch (error) {
        console.error("Error fetching saved posts: ", error.message);
      }
    };

    if (user) {
      fetchLikedPosts();
      fetchSavedPosts();
    }
  }, [user]);

  const handleLike = async (postId, currentLikes) => {
    try {
      if (likedPosts.includes(postId)) {
        const postRef = firestoreDoc(db, "sposts", postId);
        await updateDoc(postRef, { likes: currentLikes - 1 });
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.filter((id) => id !== postId)
        );
        const likedRef = collection(db, "liked");
        const queryLiked = query(
          likedRef,
          where("postId", "==", postId),
          where("userId", "==", user.uid)
        );
        const likedSnapshot = await getDocs(queryLiked);
        likedSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
      } else {
        const postRef = firestoreDoc(db, "sposts", postId);
        await updateDoc(postRef, { likes: currentLikes + 1 });
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);
        await addDoc(collection(db, "liked"), {
          id: nanoid(),
          postId: postId,
          userId: user.uid,
          username: user.displayName,
        });
      }
    } catch (error) {
      console.error("Error updating likes: ", error.message);
    }
  };

  const handleSave = async (postId) => {
    try {
      if (savedPosts.includes(postId)) {
        const savedRef = collection(db, "saved");
        const querySaved = query(
          savedRef,
          where("postId", "==", postId),
          where("userId", "==", user.uid)
        );
        const savedSnapshot = await getDocs(querySaved);
        savedSnapshot.forEach(async (doc) => {
          await deleteDoc(doc.ref);
        });
        setSavedPosts((prevSavedPosts) =>
          prevSavedPosts.filter((id) => id !== postId)
        );
      } else {
        await addDoc(collection(db, "saved"), {
          id: nanoid(),
          postId: postId,
          userId: user.uid,
        });
        setSavedPosts((prevSavedPosts) => [...prevSavedPosts, postId]);
      }
    } catch (error) {
      console.error("Error updating saved posts: ", error.message);
    }
  };

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
    <div className="min-h-screen bg-black">
      <div className="hidden lg:block">
        <Leftslidbar />
      </div>
      <div className="lg:hidden">
        <MobileNavbar />
      </div>
      <div className="pt-4 lg:pt-8 px-4 sm:px-6 lg:px-8 lg:ml-64">
        <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white text-center">
          Home
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-[#0A0A0D] rounded-lg shadow-lg overflow-hidden"
            >
              <img
                src={post.ipost}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-gray-400 text-sm mb-4">
                  {post.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-500 font-medium">
                    {post.hastags}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleLike(post.id, post.likes)}
                      className={`transition-colors duration-200 ${
                        likedPosts.includes(post.id) ? "text-pink-500" : "text-white"
                      }`}
                    >
                      <FaHeart size="20px" />
                    </button>
                    <button
                      onClick={() => handleSave(post.id)}
                      className={`text-white hover:text-yellow-500 transition-colors duration-200 ${
                        savedPosts.includes(post.id) ? "text-yellow-500" : ""
                      }`}
                    >
                      <Bookmark size="20px" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
