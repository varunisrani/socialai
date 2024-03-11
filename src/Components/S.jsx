const S = () => {
  return (
    <div className="flex ">
      <div
        className="flex-shrink-0 m-6 relative overflow-hidden  rounded-lg max-w-xs shadow-lg h-[20rem] w-80"
        style={{
          backgroundImage: `url('https://imagetolink.com/ib/IXDbgYyZVr.jpeg')`, // Replace with your image URL
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
              background: "radial-gradient(black, transparent 60%)",
              transform: "rotate3d(0, 0, 1, 20deg) scale3d(1, 0.6, 1)",
              opacity: 0.2,
            }}
          ></div>
        </div>
        <div className=" text-white px-6 pb-6 mt-6 flex flex-row absolute bottom-0 ">
          <img
            src="https://imagetolink.com/ib/IXDbgYyZVr.jpeg"
            height={40}
            width={40}
            className="rounded-full left-0 absolute ml-5"
          />
          <span className="block  mt-2 text-20px  text-white ml-10">
            Varun israni
          </span>
          <div className="flex justify-between">
            <span className="block bg-white rounded-full text-orange-500 text-xs font-bold px-3 py-2 leading-none flex items-center">
              $36.00
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default S;
