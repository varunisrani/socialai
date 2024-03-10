import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useState, useEffect } from "react";
import { db } from "./Auth/firebase";

const Search = () => {
  const [search, setSearch] = useState(""); // State to hold the search term
  const [results, setResults] = useState({ profiles: [], posts: [] }); // State to hold the search results

  useEffect(() => {
    const fetchData = () => {
      const usersRef = collection(db, "users");
      const postsRef = collection(db, "sposts");

      let userQuery = query(usersRef);
      let postQuery = query(postsRef);

      if (search.trim() !== "") {
        userQuery = query(
          usersRef,
          where("displayName", ">=", search.trim()),
          where("displayName", "<=", search.trim() + "\uf8ff")
        );

        postQuery = query(
          postsRef,
          where("title", ">=", search.trim()),
          where("title", "<=", search.trim() + "\uf8ff")
        );
      }

      const userUnsubscribe = onSnapshot(userQuery, (userSnapshot) => {
        const profilesArray = [];
        userSnapshot.forEach((userDoc) => {
          profilesArray.push({ id: userDoc.id, ...userDoc.data() });
        });

        const postUnsubscribe = onSnapshot(postQuery, (postSnapshot) => {
          const postsArray = [];
          postSnapshot.forEach((postDoc) => {
            postsArray.push({ id: postDoc.id, ...postDoc.data() });
          });

          setResults({
            profiles: profilesArray,
            posts: postsArray,
          });
        });
      });

      return () => {
        userUnsubscribe();
      };
    };

    fetchData();
  }, [search]);

  return (
    <div className="flex flex-col justify-center items-center">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name or title"
        className="p-4 w-50 border border-black mt-20"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {results.profiles.map((profile) => (
          <div
            key={profile.id}
            className="bg-white p-6 rounded-lg shadow-lg mb-8"
          >
            {/* Render user profile content here */}
            <p>{profile.displayName}</p>
            <p>{profile.email}</p>
            {/* Add more fields as needed */}
          </div>
        ))}

        {results.posts.map((post) => (
          <div key={post.id} className="bg-white p-6 rounded-lg shadow-lg mb-8">
            {/* Render post content here */}
            <p>{post.title}</p>
            <p>{post.likes}</p>
            <p>{post.hastags}</p>
            {/* Add more fields as needed */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
