import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "./Auth/firebase";
import { Link } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./Auth/firebase";
import { nanoid } from "nanoid";
import Leftslidbar from "./Leftslidbar";

const Createpost = () => {
  const [user] = useAuthState(auth);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const [image, setImage] = useState("");
  const [hastag, setHastag] = useState("");

  // Destructure properties conditionally
  const uid = auth.currentUser ? auth.currentUser.uid : null;
  const displayName = auth.currentUser ? auth.currentUser.displayName : null;
  const photoURL = auth.currentUser ? auth.currentUser.photoURL : null;

  const addData = async () => {
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
  };

  return (
    <>
      <div className="min-h-screen bg-black p-4">
        {!user ? (
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-3xl font-semibold">Login to access</h1>
          </div>
        ) : (
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
                    className="w-full bg-purple-500 rounded-lg text-white px-4 py-2  "
                    onClick={addData}
                  >
                    Submit
                  </button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Createpost;
