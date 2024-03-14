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
import Interview from "./Interview/Interview";
import Landuse from "./Landuse/Landuse";
import Buildinguse from "./Buildinguse/Buildinguse";
import Activities from "./Activities/Activities";

const viewModeArr = ["interview", "landuse", "buildinguse", "activities"];
const urlImageArr = [
  "https://images.ctfassets.net/ub3bwfd53mwy/6atCoddzStFzz0RcaztYCh/1c3e8a37eebe3c6a435038f8d9eef7f3/3_Image.jpg?w=750",
  "https://media.tenor.com/dimT0JAAMb4AAAAM/cat-cute.gif",
];

const Details = () => {
  let flying = false;
  const tableMaxWidth = 300,
    tableMaxHeight = 350;

  let { site } = useParams();
  const navbarRef = useRef();
  const { map } = useMap();
  const mouseDivRef = useRef();

  const [infoTablePosition, setInfoTablePosition] = useState(null);
  const [showInfoTable, setShowInfoTable] = useState(false);
  const [infoTable, setInfoTable] = useState([]);
  const [siteIndex, setSiteIndex] = useState(site);
  const [viewMode, setViewMode] = useState(viewModeArr[0]);

  // Handle Fitbounds
  const fitArea = useCallback(() => {
    var siteBounds = new mapboxgl.LngLatBounds();
    var siteMinLat = 90,
      siteMaxLat = -90,
      siteMinLng = 180,
      siteMaxLng = -180;

    siteSelectionData.features[siteIndex].geometry.coordinates[0].forEach(
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
  }, [siteIndex]);

  // Change Chosen Site State
  useEffect(() => {
    setSiteIndex(site);
  }, [site]);

  // Change Choose Site
  useEffect(() => {
    fitArea();
  }, [siteIndex]);

  // Delay render until fly end
  useEffect(() => {
    map.getMap().fire("flystart");

    map.getMap().on("flystart", () => {
      flying = true;
    });

    map.getMap().on("flyend", () => {
      flying = false;
      fitArea();
    });

    map.getMap().once("moveend", () => {
      if (flying) {
        map.getMap().fire("flyend");
      }
    });
  }, []);

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

  useEffect(() => {
    map.on("mousemove", "landuse_selection", (e) => {
      setShowInfoTable(true);

      let polygon =
        e.features[0].geometry.type === "Polygon"
          ? turf.polygon(e.features[0].geometry.coordinates)
          : turf.multiPolygon(e.features[0].geometry.coordinates);

      setInfoTable([
        { title: "Landuse", content: e.features[0].properties.Landuse },
        {
          title: "Area",
          content: turf.round(turf.area(polygon), 5),
        },
      ]);

      const screenX = screen.width,
        screenY = screen.height;
      let clientX = e.originalEvent.clientX,
        clientY = e.originalEvent.clientY,
        positionX = "left",
        positionY = "top",
        valueX = 20,
        valueY = 20;

      if (clientY + tableMaxHeight + 50 > screenY) {
        positionY = "bottom";
        valueY = 0;
      }
      if (clientX + tableMaxWidth + 50 > screenX) {
        positionX = "right";
        valueY = 0;
      }

      mouseDivRef.current.style.top = clientY + "px";
      mouseDivRef.current.style.left = clientX + "px";

      setInfoTablePosition({
        px: { position: positionX, value: valueX + "px" },
        py: { position: positionY, value: valueY + "px" },
      });
    });

    map.on("mouseleave", "landuse_selection", () => {
      setShowInfoTable(false);
      setInfoTablePosition(null);
    });

    return () => {
      map.off("mousemove", "landuse_selection");
      map.off("mouseleave", "landuse_selection");
    };
  }, []);

  return (
    <>
      {viewMode === viewModeArr[0] && <Interview site={siteIndex} />}

      {viewMode === viewModeArr[1] && <Landuse site={siteIndex} />}

      {viewMode === viewModeArr[2] && <Buildinguse site={siteIndex} />}

      {viewMode === viewModeArr[3] && <Activities site={siteIndex} />}

      <div className="fixed" ref={mouseDivRef}>
        {showInfoTable && (
          <InfoTable
            infoList={infoTable}
            cx={infoTablePosition.px}
            cy={infoTablePosition.py}
            maxWidth={tableMaxWidth}
            maxHeight={tableMaxHeight}
          />
        )}
      </div>

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
