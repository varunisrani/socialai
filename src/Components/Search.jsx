import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { auth, db } from "./Auth/firebase";
import { Link } from "react-flaticons";
import { useAuthState } from "react-firebase-hooks/auth";
import Leftslidbar from "./Leftslidbar";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import MobileNavbar from "./MobileNavabr";

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
      <>
        <div className="phone:hidden mid:hidden mac:hidden ">
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
      {user ? (
        <>
          <div className="flex flex-col items-center phone:hidden mid:hidden mac:hidden">
            <Leftslidbar />
          </div>
          <div className="xl:hidden">
            <MobileNavbar />
          </div>

          <div className="flex flex-col justify-center items-center mt-20">
            <h1 className="text-white text-4xl font-medium mb-10">
              Search Posts
            </h1>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or title"
              className="p-4 w-80 md:w-96 border-2 border-white rounded-full bg-[#0A0A0D] text-white"
            />

            <div className=" gap-8 mt-10">
              {results.posts.map((post) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative text-white rounded-lg shadow-lg overflow-hidden"
                >
                  <div
                    key={post.id}
                    className="relative text-white rounded-lg shadow-lg"
                    style={{ backgroundColor: "#0A0A0D" }}
                  >
                    <div
                      className="flex-shrink-0 m-6 relative overflow-hidden rounded-lg max-w-xs shadow-lg h-[20rem] w-80"
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
                      <div className="relative pt-10 px-10 flex items-center justify-center">
                        <div
                          className="block absolute w-48 h-48 bottom-0 left-0 -mb-24 ml-3"
                          style={{
                            background:
                              "radial-gradient(black, transparent 60%)",
                            transform:
                              "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
                            opacity: 0.2,
                          }}
                        ></div>
                      </div>
                      <div className="absolute bottom-0 text-white px-6 pb-6 mt-6 flex flex-row items-end w-full">
                        <img
                          src={post.ipost}
                          height={40}
                          width={40}
                          className="rounded-full"
                        />
                        <div className="ml-2">
                          <span className="block text-lg text-white">
                            {post.title}
                          </span>
                          <div className="flex justify-between">
                            <span className="block bg-white rounded-full text-orange-500 text-xs font-bold px-3 py-2 leading-none flex items-center">
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
        </>
      ) : (
        <div className="flex flex-col justify-center items-center absolute inset-0">
          <button className="bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full">
            <Link to="/signin">Login</Link>
          </button>
        </div>
      )}
    </div>
  );
};

export default Search;
