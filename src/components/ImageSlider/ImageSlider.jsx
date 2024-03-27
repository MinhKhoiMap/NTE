import { useEffect, useRef, useState } from "react";
import { Player } from "@lordicon/react";

import close from "../../assets/images/close_icon.json";

const ImageSlider = ({ imgArr }) => {
  const [imagePosition, setImagePosition] = useState(0);
  const [direction, setDirection] = useState(0);

  const close_btn = useRef(null);

  useEffect(() => {
    if ([1, -1].includes(direction)) close_btn.current?.play();
  }, [direction]);

  return (
    <div className="relative w-full h-full">
      <figure className="w-full h-full relative flex justify-center items-center overflow-hidden">
        {imgArr.map((img, index) => (
          <img
            key={index}
            className={`w-fit max-w-full h-fit max-h-full object-contain rounded-[10px] absolute transition-all ease-in-out duration-200 ${
              index === imagePosition
                ? "z-30 opacity-100"
                : "z-0 opacity-0 blur-sm"
            }`}
            src={img}
          />
        ))}
      </figure>

      <button
        className="absolute z-[999] left-[6%] top-1/2 -translate-y-1/2 flex justify-center items-center w-10 h-10 
                          rounded-full bg-black/15 hover:bg-black/80 transition-all"
        onClick={() =>
          setImagePosition((prev) => (prev < 1 ? imgArr.length - 1 : prev - 1))
        }
      >
        <svg
          className="relative right-[1px] top-[0.5px]"
          width="9"
          height="18"
          viewBox="0 0 9 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8.00009 16.9201L1.48009 10.4001C0.710088 9.63008 0.710088 8.37008 1.48009 7.60008L8.00009 1.08008"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <button
        className="absolute z-[999] right-[6%] top-1/2 -translate-y-1/2 flex justify-center items-center w-10 h-10 
                          rounded-full bg-black/15 hover:bg-black/80 transition-all"
        onClick={() =>
          setImagePosition((prev) =>
            prev === imgArr.length - 1 ? 0 : prev + 1
          )
        }
      >
        <svg
          className="relative left-[1px] top-[0.5px]"
          width="9"
          height="18"
          viewBox="0 0 9 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M0.999912 16.9201L7.51991 10.4001C8.28991 9.63008 8.28991 8.37008 7.51991 7.60008L0.999912 1.08008"
            stroke="white"
            strokeWidth="1.5"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="absolute z-[9999] flex gap-4 bottom-4 left-1/2 -translate-x-1/2">
        {imgArr.map((_, index) => (
          <div
            key={index}
            className={`rounded-full w-4 h-4 transition-colors cursor-pointer ${
              index === imagePosition ? "bg-white scale-125" : "bg-white/40"
            }`}
            onClick={() => setImagePosition(index)}
          ></div>
        ))}
      </div>

      <button
        className="absolute z-[9999] top-0 right-0"
        onMouseEnter={() => setDirection(1)}
        onMouseLeave={() => setDirection(-1)}
      >
        <Player
          colorize="#fff"
          ref={close_btn}
          icon={close}
          direction={direction}
        />
      </button>
    </div>
  );
};

export default ImageSlider;
