import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth, db } from "./Auth/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Leftslidbar from "./Leftslidbar";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import MobileNavbar from "./MobileNavabr";
import NotLoggedIn from "./NotLoggedIn";

const Search = () => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState({ posts: [] });
  const [user, loading] = useAuthState(auth);
  const [submitting] = useState(false);

  useEffect(() => {
    const fetchData = () => {
      const postsRef = collection(db, "sposts");
      let postQuery = query(postsRef);

      if (search.trim() !== "") {
        postQuery = query(
          postsRef,
          where("title", ">=", search.trim()),
          where("title", "<=", search.trim() + "\uf8ff")
        );
      }

      const postUnsubscribe = onSnapshot(postQuery, (postSnapshot) => {
        const postsArray = [];
        postSnapshot.forEach((postDoc) => {
          postsArray.push({ id: postDoc.id, ...postDoc.data() });
        });

        setResults({ posts: postsArray });
      });

      return () => {
        postUnsubscribe();
      };
    };

    fetchData();
  }, [search]);

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
      <div className="hidden lg:block">
        <Leftslidbar />
      </div>
      <div className="lg:hidden">
        <MobileNavbar />
      </div>

      <div className="flex flex-col items-center pt-4 lg:pt-8 px-2 sm:px-4 lg:ml-64">
        <h1 className="text-white text-3xl md:text-4xl font-medium mb-6 text-center">
          Search Posts
        </h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or title"
          className="p-4 w-full max-w-md border-2 border-white rounded-full bg-[#0A0A0D] text-white mb-8"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 w-full max-w-7xl">
          {results.posts.map((post) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative text-white rounded-lg shadow-lg overflow-hidden w-full"
            >
              <div
                className="relative text-white rounded-lg shadow-lg"
                style={{ backgroundColor: "#0A0A0D" }}
              >
                <div
                  className="flex-shrink-0 m-4 relative overflow-hidden rounded-lg shadow-lg h-[16rem] sm:h-[18rem] lg:h-[20rem] w-full"
                  style={{
                    backgroundImage: `url('${post.ipost}')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  <svg
                    className="absolute bottom-0 left-0 mb-8"
                    viewBox="0 0 375 283"
                    fill="none"
                    style={{ transform: "scale(1.5)", opacity: 0.1 }}
                  >
                    <rect
                      x="159.52"
                      y="175"
                      width="152"
                      height="152"
                      rx="8"
                      transform="rotate(-45 159.52 175)"
                      fill="white"
                    />
                    <rect
                      y="107.48"
                      width="152"
                      height="152"
                      rx="8"
                      transform="rotate(-45 0 107.48)"
                      fill="white"
                    />
                  </svg>
                  <div className="absolute bottom-0 text-white px-4 pb-4 flex flex-row items-end w-full">
                    <img
                      src={post.ipost}
                      height={32}
                      width={32}
                      className="rounded-full"
                      alt="Post"
                    />
                    <div className="ml-2">
                      <span className="block text-base sm:text-lg text-white">
                        {post.title}
                      </span>
                      <div className="flex justify-between">
                        <span className="block bg-white rounded-full text-orange-500 text-xs font-bold px-2 py-1 mt-1 leading-none flex items-center">
                          {post.hastags}
                        </span>
                      </div>
                    </div>
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

export default Search;
