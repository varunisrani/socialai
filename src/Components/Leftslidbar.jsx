import { Add, Bookmark, Heart, Home, PhotoVideo, User } from "react-flaticons";
import { Link } from "react-router-dom";

const Leftslidbar = () => {
  return (
    <>
      <div className="bg-[#0A0A0D]">
        <div className="container flex flex-col mx-auto bg-[#0A0A0D]">
          <div
            className="group/sidebar flex flex-col shrink-0 lg:w-[300px] w-[250px] transition-all duration-300 ease-in-out m-0 fixed z-40 inset-y-0 left-0 bg-[#0A0A0D] border-r border-r-dashed border-r-neutral-200 sidenav fixed-start loopple-fixed-start"
            id="sidenav-main"
          >
            <div className="flex flex-row shrink-0 px-8 items-center justify-between h-[96px]">
              <Link
                className="transition-colors duration-200 ease-in-out"
                href="https://www.loopple.com"
              >
                <div className="flex flex-row">
                  <img
                    alt="Logo"
                    src="https://raw.githubusercontent.com/Loopple/loopple-public-assets/main/riva-dashboard-tailwind/img/logos/loopple.svg"
                    className="inline"
                  />
                  <h1 className="mt-1 ml-5 font-medium text-white text-2xl">
                    Social ai
                  </h1>
                </div>
              </Link>
            </div>

            <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200"></div>

            <div className="relative pl-3 my-5 overflow-y-scroll">
              <div className="flex flex-col w-full font-medium">
                <div>
                  <Link to="/">
                    <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                      <Link
                        to="/"
                        className="flex items-center flex-grow text-[1.15rem] text-white bg-gradient-to-r from-purple-500 to-purple-800 w-20 p-4 rounded-lg transition-all duration-300 ease-in-out"
                      >
                        <Home color="white" size="22px" />
                        <h1 className="mt-1 ml-2 font-medium text-xl">Home</h1>
                      </Link>
                    </span>
                  </Link>
                </div>

                <div>
                  <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                    <Link
                      to="/search"
                      className="flex items-center flex-grow text-[1.15rem] w-20 p-4  text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-800 hover:rounded-lg"
                    >
                      <PhotoVideo className="text-white" size="24px" />
                      <h1 className="mt-1 ml-2 font-medium text-xl">Explore</h1>
                    </Link>
                  </span>
                </div>
                <div>
                  <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                    <Link
                      to="/people"
                      className="flex items-center flex-grow text-[1.15rem] text-white w-20 p-4 hover:w-20 hover:p-4 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-800 hover:rounded-lg"
                    >
                      <User className="text-white" size="24px" />
                      <h1 className="mt-1 ml-2 font-medium text-xl">People</h1>
                    </Link>
                  </span>
                </div>
                <div>
                  <Link to="/save">
                    <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                      <Link
                        href="javascript:;"
                        className="flex items-center flex-grow text-[1.15rem]w-20 p-4  text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-800 hover:rounded-lg"
                      >
                        <Bookmark className="text-white" size="24px" />
                        <h1 className="mt-1 ml-2 font-medium text-xl">Saved</h1>
                      </Link>
                    </span>
                  </Link>
                </div>
                <div>
                  <Link to="/youlike">
                    <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                      <Link
                        href="javascript:;"
                        className="flex items-center flex-grow text-[1.15rem]w-20 p-4  text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-800 hover:rounded-lg"
                      >
                        <Heart className="text-white" size="24px" />
                        <h1 className="mt-1 ml-2 font-medium text-xl">
                          Liked Post
                        </h1>
                      </Link>
                    </span>
                  </Link>
                </div>
                <div>
                  <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                    <Link
                      to="/cpost"
                      className="flex items-center flex-grow text-[1.15rem] w-20 p-4  text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r hover:from-purple-500 hover:to-purple-800 hover:rounded-lg"
                    >
                      <Add className="text-white" size="24px" />
                      <h1 className="mt-1 ml-2 font-medium text-xl">
                        Create Post
                      </h1>
                    </Link>
                  </span>
                </div>

                {/* Repet the pattern for other links */}
              </div>
            </div>
            {/* ... (rest of your code) ... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Leftslidbar;
