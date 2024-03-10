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
      const user = await signInWithPopup(auth, provider);
      console.log(user);
    } catch (err) {
      console.log(err.message);
    }
  };

  const addData = async () => {
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
    });
    alert("User get");
  };
  const logout = async () => {
    await auth.signOut();
  };
  const [user] = useAuthState(auth);
  return (
    <div className="flex justify-center items-center absolute inset-0">
      {user ? (
        <div className="flex flex-col justify-center items-center">
          <h1>Hello {user.email}</h1>
          <h1>Please go to home page</h1>
          <button
            className=" bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full"
            onClick={logout}
          >
            Logout
          </button>
          <button
            className=" bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full"
            onClick={addData}
          >
            <Link to="/">Home</Link>
          </button>
        </div>
      ) : (
        <button
          className=" bg-white shadow-xl text-blue-700 font-bold w-20 p-4 rounded-full"
          onClick={google}
        >
          Login
        </button>
      )}
    </div>
  );
};

export default Signin;
