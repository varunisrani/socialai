import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./Components/Home";
import Signin from "./Components/Auth/Signin";
import Createpost from "./Components/Createpost";
import ShowLike from "./Components/Showlike";
import Saved from "./Components/Saved";
import Search from "./Components/Search";
import Leftslidbar from "./Components/Leftslidbar";
import People from "./Components/People";
import Profile from "./Components/Profile";
import UserProfile from "./Components/UserProfile";
import Task from "./Components/Task";
import Task2 from "./Components/Task2";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },

  {
    path: "/left",
    element: <Leftslidbar />,
  },
  {
    path: "/cpost",
    element: <Createpost />,
  },
  {
    path: "/task",
    element: <Task />,
  },
  {
    path: "/task2",
    element: <Task2 />,
  },
  {
    path: "/signin",
    element: <Signin />,
  },
  {
    path: "/youlike",
    element: <ShowLike />,
  },
  {
    path: "/save",
    element: <Saved />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/people",
    element: <People />,
  },

  {
    path: "/peoples/:_id",
    element: <UserProfile />,
  },
]);
function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
