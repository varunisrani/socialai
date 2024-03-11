import { GoogleAuthProvider } from "firebase/auth";
import { auth, db } from "./firebase";
import { signInWithPopup } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Link } from "react-router-dom";
import { addDoc, collection } from "firebase/firestore";

const Signin = () => {
  const google = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Add user data to the users table

      console.log(user);
    } catch (err) {
      console.log(err.message);
    }
  };

  const addUserData = async () => {
    try {
      const usersCollection = collection(db, "users");
      await addDoc(usersCollection, {
        displayName: user.displayName,
        uid: user.uid,
        photoURL: user.photoURL,
        email: user.email,
      });
      console.log("User data added successfully!");
    } catch (error) {
      console.error("Error adding user data: ", error.message);
    }
  };
  const logout = async () => {
    await auth.signOut();
  };

  const [user] = useAuthState(auth);

  return (
    <div className="flex justify-center items-center absolute inset-0 bg-black">
      {user ? (
        <div className="flex flex-row justify-center items-center text-white">
          <h1>Hello {user.email}</h1>
          <h1>Please go to home page</h1>
          <button
            className="bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full"
            onClick={logout}
          >
            Logout
          </button>
          <Link to="/">
            <button
              className="bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full"
              onClick={addUserData}
            >
              home
            </button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col">
          <h1 className="uppercase text-5xl text-white">Social AI</h1>
          <button
            className="w-100 p-2 bg-purple-500 rounded-lg text-white mt-10 font-medium"
            onClick={google}
          >
            Login
          </button>
        </div>
      )}
    </div>
  );
};

export default Signin;
