import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { initialViewState } from "../../contexts/initialViewContext";
import { useMap } from "react-map-gl";
import * as turf from "@turf/turf";

import "./HomePage.css";
import logo from "../../assets/images/logo.svg";

const HomePage = () => {
  const initialView = useContext(initialViewState);
  const { map } = useMap();

  useEffect(() => {
    if (map) {
      let center = turf.randomPoint(1, { bbox: [-180, -90, 180, 90] });

      map.flyTo({
        center: center.features[0].geometry.coordinates,
        zoom: initialView.zoom,
      });
    }
  }, []);

  return (
    <>
      <div className="absolute top-9 left-10 xl:w-1/3 w-1/4">
        <h1 className="project-name text-white uppercase">
          Night Time Economy
        </h1>
        <p className=" text-white text-justify mr-6 break-words mt-6">
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Odit omnis
          provident reiciendis eius debitis, assumenda officiis iusto
          recusandae. Quo itaque iure sunt magni quam expedita ratione
          exercitationem aspernatur veritatis doloribus.
        </p>
      </div>
      <Link
        to="/nha_trang"
        id="fly"
        className="absolute bottom-[50px] left-1/2 -translate-x-1/2 border border-white"
      >
        <span>Start</span>
      </Link>
      <div className="logo__container fixed bottom-11 left-[25px]">
        <img src={logo} />
      </div>
    </>
  );
};

export default HomePage;
