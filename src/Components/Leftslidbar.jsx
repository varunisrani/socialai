import { Add, Bookmark, Home, PhotoVideo, User } from "react-flaticons";

const Leftslidbar = () => {
  return (
    <div className="bg-[#0A0A0D]">
      <div className="container flex flex-col mx-auto bg-[#0A0A0D]">
        <div
          className="group/sidebar flex flex-col shrink-0 lg:w-[300px] w-[250px] transition-all duration-300 ease-in-out m-0 fixed z-40 inset-y-0 left-0 bg-[#0A0A0D] border-r border-r-dashed border-r-neutral-200 sidenav fixed-start loopple-fixed-start"
          id="sidenav-main"
        >
          <div className="flex flex-row shrink-0 px-8 items-center justify-between h-[96px]">
            <a
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
            </a>
          </div>

          <div className="hidden border-b border-dashed lg:block dark:border-neutral-700/70 border-neutral-200"></div>

          <div className="relative pl-3 my-5 overflow-y-scroll">
            <div className="flex flex-col w-full font-medium">
              <div>
                <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                  <a
                    href="javascript:;"
                    className="flex items-center flex-grow text-[1.15rem] text-white w-20 p-4 rounded-lg bg-gradient-to-r from-#03001e via-#7303c0 to-#ec38bc  :rounded-lg transition-all duration-300 ease-in-out"
                  >
                    <Home color="white" size="22px" />
                    <h1 className="mt-1 ml-2 font-medium text-xl">Home</h1>
                  </a>
                </span>
              </div>

              <div>
                <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                  <a
                    href="javascript:;"
                    className="flex items-center flex-grow text-[1.15rem] text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r from-#03001e via-#7303c0 to-#ec38bc w-20 p-4 bg-[#0A0A0D] hover:rounded-lg transition-all duration-300 ease-in-out"
                  >
                    <PhotoVideo className="text-white" size="24px" />
                    <h1 className="mt-1 ml-2 font-medium text-xl">Explore</h1>
                  </a>
                </span>
              </div>
              <div>
                <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                  <a
                    href="javascript:;"
                    className="flex items-center flex-grow text-[1.15rem] text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r from-#03001e via-#7303c0 to-#ec38bc w-20 p-4 bg-[#0A0A0D] hover:rounded-lg transition-all duration-300 ease-in-out"
                  >
                    <User className="text-white" size="24px" />
                    <h1 className="mt-1 ml-2 font-medium text-xl">People</h1>
                  </a>
                </span>
              </div>
              <div>
                <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                  <a
                    href="javascript:;"
                    className="flex items-center flex-grow text-[1.15rem] text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r from-#03001e via-#7303c0 to-#ec38bc w-20 p-4 bg-[#0A0A0D] hover:rounded-lg transition-all duration-300 ease-in-out"
                  >
                    <Bookmark className="text-white" size="24px" />
                    <h1 className="mt-1 ml-2 font-medium text-xl">Saved</h1>
                  </a>
                </span>
              </div>
              <div>
                <span className="select-none flex items-center px-4 py-[.775rem] cursor-pointer my-[.4rem] rounded-[.95rem]">
                  <a
                    href="javascript:;"
                    className="flex items-center flex-grow text-[1.15rem] text-white hover:w-20 hover:p-4 hover:bg-gradient-to-r from-#03001e via-#7303c0 to-#ec38bc w-20 p-4 bg-[#0A0A0D] hover:rounded-lg transition-all duration-300 ease-in-out"
                  >
                    <Add className="text-white" size="24px" />
                    <h1 className="mt-1 ml-2 font-medium text-xl">
                      Create Post
                    </h1>
                  </a>
                </span>
              </div>

              {/* Repeat the pattern for other links */}
            </div>
          </div>
          {/* ... (rest of your code) ... */}
        </div>
      </div>
    </div>
  );
};

export default Leftslidbar;
