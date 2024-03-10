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
import { auth, db } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { nanoid } from "nanoid";
import { motion } from "framer-motion";

const Home = () => {
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);

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

    return () => unsubscribe(); // Cleanup the listener when the component unmounts
  };

  useEffect(() => {
    showData();
  }, []);

  useEffect(() => {
    const fetchLikedPosts = async () => {
      try {
        // Fetch liked posts from the "liked" collection for the current user
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
        // Fetch saved posts from the "saved" collection for the current user
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

  const deleteBlogPost = async (postId) => {
    try {
      const postRef = firestoreDoc(db, "sposts", postId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post: ", error.message);
    }
  };

  const handleLike = async (postId, currentLikes) => {
    try {
      // Check if the post is already liked
      if (likedPosts.includes(postId)) {
        // Unlike the post
        const postRef = firestoreDoc(db, "sposts", postId);

        // Update the likes count in Firestore
        await updateDoc(postRef, { likes: currentLikes - 1 });

        // Update the likedPosts state to remove the liked post
        setLikedPosts((prevLikedPosts) =>
          prevLikedPosts.filter((id) => id !== postId)
        );

        // Remove like data from the "liked" collection
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
        // Like the post
        const postRef = firestoreDoc(db, "sposts", postId);

        // Update the likes count in Firestore
        await updateDoc(postRef, { likes: currentLikes + 1 });

        // Update the likedPosts state to track the liked post
        setLikedPosts((prevLikedPosts) => [...prevLikedPosts, postId]);

        // Add like data to the "liked" collection
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
      // Check if the post is already saved
      if (savedPosts.includes(postId)) {
        // Remove save data from the "saved" collection
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

        // Update the savedPosts state to remove the saved post
        setSavedPosts((prevSavedPosts) =>
          prevSavedPosts.filter((id) => id !== postId)
        );
      } else {
        // Save the post
        await addDoc(collection(db, "saved"), {
          id: nanoid(),
          postId: postId,
          userId: user.uid,
        });

        // Update the savedPosts state to track the saved post
        setSavedPosts((prevSavedPosts) => [...prevSavedPosts, postId]);
      }
    } catch (error) {
      console.error("Error updating saved posts: ", error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-4">
      {!user ? (
        <div className="flex flex-col justify-center items-center absolute inset-0">
          <button className="bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full">
            <Link to="/signin">Login</Link>
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mt-8 mb-4 text-white">
            Welcome to Social AI
          </h1>
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-5xl font-bold text-white mb-8">Latest Posts</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((data) => (
                <motion.div
                  key={data.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
                    <img
                      src={data.ipost}
                      className="mt-4 rounded-lg"
                      alt="Post"
                    />
                    <h1 className="text-2xl font-bold mb-4 mt-4">
                      {data.title}
                    </h1>
                    <p className="text-gray-700">{data.post}</p>
                    <h1 className="mt-3">
                      {data.hastags} Likes {data.likes}
                    </h1>
                    <div className="flex items-center mt-4">
                      <img
                        src={data.photo}
                        alt="User Avatar"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="text-gray-600">{data.name}</span>
                    </div>
                    <button
                      className={`mt-4 bg-blue-500 mr-5 text-white px-3 py-1 rounded hover:bg-red-600 ${
                        likedPosts.includes(data.id) ? "bg-red-600" : ""
                      }`}
                      onClick={() => handleLike(data.id, data.likes)}
                    >
                      {likedPosts.includes(data.id) ? "Unlike" : "Like"}
                    </button>
                    <button
                      className={`mt-4 bg-blue-500 mr-5 text-white px-3 py-1 rounded hover:bg-red-600 ${
                        savedPosts.includes(data.id) ? "bg-red-600" : ""
                      }`}
                      onClick={() => handleSave(data.id)}
                    >
                      {savedPosts.includes(data.id) ? "Unsave" : "Save"}
                    </button>
                    {user.uid === data.uid && (
                      <button
                        className="mt-4 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        onClick={() => deleteBlogPost(data.id)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
