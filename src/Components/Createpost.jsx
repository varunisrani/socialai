import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./Auth/firebase";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Auth/firebase";
import { nanoid } from "nanoid";
import Leftslidbar from "./Leftslidbar";
import ClipLoader from "react-spinners/ClipLoader";

const Createpost = () => {
  const [user, loading] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [hastag, setHastag] = useState("");
  const [submitting, setSubmitting] = useState(false); // Added state for submission loading

  const uid = auth.currentUser ? auth.currentUser.uid : null;
  const displayName = auth.currentUser ? auth.currentUser.displayName : null;
  const photoURL = auth.currentUser ? auth.currentUser.photoURL : null;

  const addData = async () => {
    try {
      setSubmitting(true); // Set submitting to true when starting submission
      await addDoc(collection(db, "sposts"), {
        postId: nanoid(),
        title: title,
        post: post,
        ipost: image,
        uid: uid,
        name: displayName,
        photo: photoURL,
        hastags: hastag,
        likes: 0,
      });
      alert("Post added successfully");
      setTitle("");
      setPost("");
    } catch (error) {
      console.error("Error adding post:", error);
    } finally {
      setSubmitting(false); // Reset submitting to false after submission
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
            <div className="flex flex-col items-center mt-20">
              <h1 className="text-4xl font-bold mb-8 text-white">
                Create Post
              </h1>
              <div className="w-full max-w-md text-white">
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter Your post Title"
                  className="w-full p-3 border rounded mb-4 bg-[#0A0A0D]"
                />
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Enter Your post Image URL"
                  className="w-full p-3 border rounded mb-4 bg-[#0A0A0D]"
                />
                <input
                  type="text"
                  value={hastag}
                  onChange={(e) => setHastag(e.target.value)}
                  placeholder="Enter Your post Hastags"
                  className="w-full p-3 border rounded mb-4 bg-[#0A0A0D]"
                />
                <textarea
                  type="text"
                  value={post}
                  onChange={(e) => setPost(e.target.value)}
                  placeholder="Enter post captions"
                  className="w-full p-3 border rounded mb-6 bg-[#0A0A0D]"
                  rows="4"
                />
                <Link to="/">
                  <button
                    className="w-full bg-purple-500 rounded-lg text-white px-4 py-2"
                    onClick={addData}
                    disabled={submitting} // Disable button while submitting
                  >
                    {submitting ? "Submitting..." : "Submit"}
                  </button>
                </Link>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-screen text-white">
            <h1 className="text-3xl font-semibold">Login to access</h1>
          </div>
        )}
      </div>
    </>
  );
};

export default Createpost;
