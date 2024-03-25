import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { useMap } from "react-map-gl";
import * as turf from "@turf/turf";

// Assets
import "./Details.css";
import { siteSelectionData } from "../../assets/data/site";

// Components
import InfoTable from "../../components/InfoTable/InfoTable";
import Interview from "./Interact/Interview/Interview";
import Landuse from "./Interact/Landuse/Landuse";
import Buildinguse from "./Interact/Buildinguse/Buildinguse";
import Activities from "./Interact/Activities/Activities";

const viewModeArr = ["interview", "landuse", "buildinguse", "activities"];
const urlImageArr = [
  "https://images.ctfassets.net/ub3bwfd53mwy/6atCoddzStFzz0RcaztYCh/1c3e8a37eebe3c6a435038f8d9eef7f3/3_Image.jpg?w=750",
  "https://media.tenor.com/dimT0JAAMb4AAAAM/cat-cute.gif",
];

const Details = () => {
  let { site } = useParams();
  const navbarRef = useRef();
  const { map } = useMap();

  const [siteIndex, setSiteIndex] = useState(null);
  const [viewMode, setViewMode] = useState(viewModeArr[0]);

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
        e.clientY <= 40 ||
        String(e.target.parentNode.className).includes("details__navbar")
      ) {
        navbarRef.current.classList.add("details__navbar--show");
      } else {
        navbarRef.current.classList.remove("details__navbar--show");
      }
    }

    document.addEventListener("mousemove", handleShowNavbar);

    return () => {
      document.removeEventListener("mousemove", handleShowNavbar);
    };
  }, []);

  return (
    <>
      {viewMode === viewModeArr[0] && siteIndex && (
        <Interview site={siteIndex} />
      )}

      {viewMode === viewModeArr[1] && <Landuse site={siteIndex} />}

      {viewMode === viewModeArr[2] && <Buildinguse site={siteIndex} />}

      {viewMode === viewModeArr[3] && <Activities site={siteIndex} />}

      <div className="details__navbar" ref={navbarRef}>
        <div className="pl-16 pr-11 text-[#000] bg-[#FFC436]">
          Area {Number(siteIndex) + 1}
        </div>
        <Link className="px-5 text-white">Overview</Link>
        <Link className="px-5 text-white">Project</Link>
        <Link className="pl-5 pr-16 text-white">Interact</Link>
      </div>
      <div className="details__filter">
        <div
          className={`details__filter-tool ${
            viewMode === viewModeArr[2] && "details__filter-tool--active"
          }`}
          onClick={() => setViewMode(viewModeArr[2])}
        >
          <p>Building Use</p>
        </div>
        <div
          className={`details__filter-tool ${
            viewMode === viewModeArr[1] && "details__filter-tool--active"
          }`}
          onClick={() => setViewMode(viewModeArr[1])}
        >
          <p>Land Use</p>
        </div>
        <div
          className={`details__filter-tool ${
            viewMode === viewModeArr[3] && "details__filter-tool--active"
          }`}
          onClick={() => setViewMode(viewModeArr[3])}
        >
          <p>Activities Point</p>
        </div>
        <div
          className={`details__filter-tool ${
            viewMode === viewModeArr[0] && "details__filter-tool--active"
          }`}
          onClick={() => setViewMode(viewModeArr[0])}
        >
          <p>Interview Point</p>
        </div>
      </div>
    </>
  );
};

export default Details;
