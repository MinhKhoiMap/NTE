import { useContext, useEffect } from "react";
import "./HomePage.css";
import { Link } from "react-router-dom";
import { initialViewState } from "../../contexts/initialViewContext";

const HomePage = ({ map }) => {
  const initialView = useContext(initialViewState);

  const handleStartPorject = () => {
    map.flyTo({
      center: [109.1900332, 12.2399182],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 12.5,
      speed: 1.2,
    });
  };

  useEffect(() => {
    if (map)
      map.flyTo({
        center: [initialView.lng, initialView.lat],
        zoom: initialView.zoom,
      });
  }, []);

  return (
    <>
      <h1 className="absolute top-9 left-10 text-white uppercase">
        nha trang economy
      </h1>
      <Link
        to="/nha_trang"
        id="fly"
        className="absolute bottom-[50px] left-1/2 -translate-x-1/2 flex items-center"
        onClick={handleStartPorject}
      >
        <span>Start</span>
        <svg
          className="ml-5 mt-[5px]"
          xmlns="http://www.w3.org/2000/svg"
          width="44"
          height="44"
          viewBox="0 0 44 44"
          fill="none"
        >
          <path
            d="M5.49999 33C4.98055 33 4.54543 32.824 4.19466 32.472C3.84388 32.12 3.66788 31.6849 3.66666 31.1667V12.8333C3.66666 12.3139 3.84266 11.8788 4.19466 11.528C4.54666 11.1772 4.98177 11.0012 5.49999 11C6.01943 11 6.45516 11.176 6.80716 11.528C7.15916 11.88 7.33455 12.3151 7.33332 12.8333V31.1667C7.33332 31.6861 7.15732 32.1218 6.80532 32.4738C6.45332 32.8258 6.01821 33.0012 5.49999 33ZM33.3208 23.8333H12.8333C12.3139 23.8333 11.8788 23.6573 11.528 23.3053C11.1772 22.9533 11.0012 22.5182 11 22C11 21.4806 11.176 21.0454 11.528 20.6947C11.88 20.3439 12.3151 20.1679 12.8333 20.1667H33.3208L28.05 14.85C27.7139 14.5139 27.5379 14.0941 27.522 13.5905C27.5061 13.0869 27.6821 12.6512 28.05 12.2833C28.3861 11.9472 28.8139 11.7792 29.3333 11.7792C29.8528 11.7792 30.2805 11.9472 30.6167 12.2833L39.05 20.7167C39.2333 20.9 39.3635 21.0986 39.4405 21.3125C39.5175 21.5264 39.5554 21.7556 39.5542 22C39.5542 22.2444 39.5163 22.4736 39.4405 22.6875C39.3647 22.9014 39.2345 23.1 39.05 23.2833L30.6167 31.7167C30.2805 32.0528 29.8607 32.2208 29.3572 32.2208C28.8536 32.2208 28.4179 32.0528 28.05 31.7167C27.6833 31.35 27.5 30.9149 27.5 30.4113C27.5 29.9078 27.6833 29.4721 28.05 29.1042L33.3208 23.8333Z"
            fill="white"
          />
        </svg>
      </Link>
    </>
  );
};

export default HomePage;
