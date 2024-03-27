import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { useMap } from "react-map-gl";
import * as turf from "@turf/turf";
import $ from "jquery";

// Assets
import "./Details.css";
import { siteSelectionData } from "../../assets/data/site";
import Interact from "./Interact/Interact";
import Project from "./Project/Project";
import Overview from "./Overview/Overview";

const viewModeArr = ["Overview", "Projecct", "Interact"];

const areaName = "nha trang";

const Details = () => {
  let { site } = useParams();
  const navbarRef = useRef();
  const { map } = useMap();

  const [siteIndex, setSiteIndex] = useState(null);
  const [viewMode, setViewMode] = useState(viewModeArr[2]);

  // Handle Fitbounds
  const fitArea = () => {
    if (siteIndex) {
      var siteMinLat = 90,
        siteMaxLat = -90,
        siteMinLng = 180,
        siteMaxLng = -180;

      siteSelectionData.features[siteIndex]?.geometry.coordinates[0].forEach(
        (coordinate) => {
          siteMaxLat = Math.max(coordinate[1], siteMaxLat);
          siteMinLat = Math.min(coordinate[1], siteMinLat);
          siteMaxLng = Math.max(coordinate[0], siteMaxLng);
          siteMinLng = Math.min(coordinate[0], siteMinLng);
        }
      );

      var siteBounds = new mapboxgl.LngLatBounds([
        [siteMaxLng, siteMaxLat],
        [siteMinLng, siteMinLat],
      ]);

      map.fitBounds(siteBounds, {
        padding: { top: 60, bottom: 60, left: 60, right: 60 },
      });
    }
  };

  // Change Chosen Site State
  useEffect(() => {
    setSiteIndex(site);
  });

  // Handle Fit Bounds When Change Site State
  useEffect(() => {
    fitArea();
  }, [siteIndex]);

  // handle Top Navbar
  useEffect(() => {
    function handleShowNavbar(e) {
      if (
        (navbarRef.current && e.clientY <= 40) ||
        $(e.target).parents(".details__navbar").length ||
        $(e.target).hasClass("details__navbar")
      ) {
        navbarRef.current.classList.add("details__navbar--show");
      } else {
        navbarRef.current.classList.remove("details__navbar--show");
      }
    }

    let timer = setTimeout(() => {
      document.addEventListener("mousemove", handleShowNavbar);
    }, 1500);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mousemove", handleShowNavbar);
    };
  }, []);

  return (
    <>
      <div
        className="details__navbar details__navbar--show opacity-100"
        ref={navbarRef}
      >
        <div className="flex flex-col justify-center gap-1">
          <h3 className="capitalize">{areaName} Night Economy</h3>
          <p>Area {siteIndex && Number(siteIndex) + 1}</p>
        </div>
        <div>
          <button
            className={`text-white text-center ${
              viewMode === viewModeArr[0] && "current-mode"
            }`}
            onClick={() => setViewMode(viewModeArr[0])}
          >
            Overview
          </button>
          <button
            className={`text-white text-center ${
              viewMode === viewModeArr[1] && "current-mode"
            }`}
            onClick={() => setViewMode(viewModeArr[1])}
          >
            Project
          </button>
          <button
            className={`text-white text-center ${
              viewMode === viewModeArr[2] && "current-mode"
            }`}
            onClick={() => setViewMode(viewModeArr[2])}
          >
            Interact
          </button>
        </div>
      </div>

      {viewMode === viewModeArr[2] && <Interact siteIndex={siteIndex} />}
      {viewMode === viewModeArr[1] && <Project />}
      {viewMode === viewModeArr[0] && <Overview />}
    </>
  );
};

export default Details;
