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
import { Bookmark, Heart } from "react-flaticons";

const Home = () => {
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [submitting] = useState(false);

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

  const fetchUsers =  () => {
    try {
      const usersCollection = collection(db, "users");
      const usersSnapshot =  getDocs(usersCollection);
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
    } catch (error) {
      console.error("Error fetching users: ", error.message);
    }

  useEffect(()=>(
    fetchUsers();
  ),[])
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

  /*const deleteBlogPost = async (postId) => {
    try {
      const postRef = firestoreDoc(db, "sposts", postId);
      await deleteDoc(postRef);
      console.log("Post deleted successfully!");
    } catch (error) {
      console.error("Error deleting post: ", error.message);
    }
  };*/

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
      {!user ? (
        <div className="flex flex-col justify-center items-center absolute inset-0">
          <button className="bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full">
            <Link to="/signin">Login</Link>
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center">
            <Leftslidbar />
          </div>
          <div className="flex justify-center items-center flex-col">
            <h1 className="text-4xl font-bold mt-8 mb-4 text-white">
              Welcome to Social AI
            </h1>
            <h1 className="text-5xl font-bold text-white mb-8">Latest Posts</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="flex flex-col gap-10">
                {posts.map((data) => (
                  <motion.div
                    key={data.id}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <>
                      <div className="bg-[#0A0A0D] p-10 rounded-lg shadow-md max-w-md">
                        <div className="flex items-center justify-between mb-4">
                          <Link to={`/peoples/${userData.uid}`}>
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
                          </Link>
                          <div className="text-gray-500 cursor-pointer">
                            <button className="hover:bg-gray-50 rounded-full p-1">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                // eslint-disable-next-line react/no-unknown-property
                                stroke-width="2"
                                // eslint-disable-next-line react/no-unknown-property
                                stroke-linecap="round"
                                // eslint-disable-next-line react/no-unknown-property
                                stroke-linejoin="round"
                              >
                                <circle cx="12" cy="7" r="1" />
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="17" r="1" />
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
                          <div className="flex items-center space-x-2">
                            <button
                              className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
                              onClick={() => handleLike(data.id, data.likes)}
                            >
                              {likedPosts.includes(data.id) ? (
                                <Heart color="#E75480" />
                              ) : (
                                <Heart />
                              )}
                              <span>{data.likes}</span>
                            </button>
                          </div>
                          <button
                            className="flex justify-center items-center gap-2 px-2 hover:bg-gray-50 rounded-full p-1"
                            onClick={() => handleSave(data.id)}
                          >
                            {savedPosts.includes(data.id) ? (
                              <Bookmark color="#871F78" />
                            ) : (
                              <Bookmark />
                            )}
                          </button>
                        </div>
                      </div>
                    </>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
