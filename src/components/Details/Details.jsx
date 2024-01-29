import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { Layer, Marker, Source, useMap } from "react-map-gl";

import "./Details.css";
import { interviewPointData } from "../../assets/data/interview";
import { siteSelectionData } from "../../assets/data/site";
import { landuseData } from "../../assets/data/landuse";
import { buildinguseData } from "../../assets/data/buildinguse";
import { activitiesData } from "../../assets/data/activities";

const viewModeArr = ["interview", "landuse", "buildinguse", "activities"];

const Details = () => {
  let flying = false;
  let { site } = useParams();
  const navbarRef = useRef();
  const { map } = useMap();

  const [siteIndex, setSiteIndex] = useState(site);
  const [viewMode, setViewMode] = useState(viewModeArr[0]);

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
      padding: { top: 20, bottom: 20, left: 250, right: 500 },
    });
  }, [siteIndex]);

  useEffect(() => {
    setSiteIndex(site);
    fitArea();
  });

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
      {viewMode === viewModeArr[0] && (
        <Source type="geojson" data={interviewPointData[siteIndex]}>
          {interviewPointData[siteIndex].features.map((feature, index) => {
            return (
              <Marker
                key={index}
                longitude={feature.geometry.coordinates[0]}
                latitude={feature.geometry.coordinates[1]}
              ></Marker>
            );
          })}
        </Source>
      )}

      {viewMode === viewModeArr[1] && (
        <Source type="geojson" data={landuseData[siteIndex]}>
          {/* {landuseData[siteIndex].features.map((feature, index) => {
            return ( */}
          <Layer type="line" paint={{ "line-color": "pink" }} />
          <Layer
            type="fill"
            paint={{ "fill-color": "rgba(255, 196, 54, 0.3)" }}
          />
          {/* );
          })} */}
        </Source>
      )}

      {viewMode === viewModeArr[2] && (
        <Source type="geojson" data={buildinguseData[siteIndex]}>
          {/* {landuseData[siteIndex].features.map((feature, index) => {
            return ( */}
          <Layer type="line" paint={{ "line-color": "pink" }} />
          <Layer
            type="fill"
            paint={{ "fill-color": "rgba(255, 196, 54, 0.3)" }}
          />
          {/* );
          })} */}
        </Source>
      )}

      {viewMode === viewModeArr[3] && (
        <Source type="geojson" data={activitiesData[siteIndex]}>
          {activitiesData[siteIndex].features.map((feature, index) => {
            return (
              <Marker
                key={index}
                longitude={feature.geometry.coordinates[0][0]}
                latitude={feature.geometry.coordinates[0][1]}
              ></Marker>
            );
          })}
        </Source>
      )}

      <div className="details__navbar" ref={navbarRef}>
        <div className="pl-16 pr-11 text-[#000] bg-[#FFC436]">
          Area name {siteIndex}
        </div>
        <Link className="px-5 text-white">Overview</Link>
        <Link className="px-5 text-white">Project</Link>
        <Link className="pl-5 pr-16 text-white">Interact</Link>
      </div>
      <div className="details__filter">
        <div
          className="details__filter-tool"
          onClick={() => setViewMode(viewModeArr[2])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="26"
            viewBox="0 0 25 26"
            fill="none"
          >
            <path
              d="M22.15 5.16667H15.1V24.75H23.7166V6.73333C23.7166 6.31783 23.5516 5.91934 23.2578 5.62553C22.964 5.33173 22.5655 5.16667 22.15 5.16667ZM18.2333 18.4833H16.6666V16.9167H18.2333V18.4833ZM18.2333 14.5667H16.6666V13H18.2333V14.5667ZM18.2333 10.65H16.6666V9.08333H18.2333V10.65ZM21.3666 18.4833H19.8V16.9167H21.3666V18.4833ZM21.3666 14.5667H19.8V13H21.3666V14.5667ZM21.3666 10.65H19.8V9.08333H21.3666V10.65Z"
              stroke="white"
              strokeLinejoin="round"
            />
            <path
              d="M11.8727 1.25H2.66067C2.22023 1.25 1.79783 1.42496 1.4864 1.7364C1.17496 2.04783 1 2.47023 1 2.91067V24.75H4.91667V22.4H9.61667V24.75H13.5333V2.91067C13.5333 2.47023 13.3584 2.04783 13.0469 1.7364C12.7355 1.42496 12.3131 1.25 11.8727 1.25ZM4.91667 18.4833H3.35V16.9167H4.91667V18.4833ZM4.91667 14.5667H3.35V13H4.91667V14.5667ZM4.91667 10.65H3.35V9.08333H4.91667V10.65ZM4.91667 6.73333H3.35V5.16667H4.91667V6.73333ZM8.05 18.4833H6.48333V16.9167H8.05V18.4833ZM8.05 14.5667H6.48333V13H8.05V14.5667ZM8.05 10.65H6.48333V9.08333H8.05V10.65ZM8.05 6.73333H6.48333V5.16667H8.05V6.73333ZM11.1833 18.4833H9.61667V16.9167H11.1833V18.4833ZM11.1833 14.5667H9.61667V13H11.1833V14.5667ZM11.1833 10.65H9.61667V9.08333H11.1833V10.65ZM11.1833 6.73333H9.61667V5.16667H11.1833V6.73333Z"
              stroke="white"
              strokeLinejoin="round"
            />
          </svg>
          <p>Building Use</p>
        </div>
        <div
          className="details__filter-tool"
          onClick={() => setViewMode(viewModeArr[1])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M2 0H18C19.1 0 20 0.9 20 2V8H8V18H12.55C12.73 18.3 12.91 18.58 13.09 18.84C13.38 19.27 13.66 19.66 13.92 20H2C0.9 20 0 19.1 0 18V2C0 0.9 0.9 0 2 0ZM6 2H2V12H6V2ZM2 14V18H6V14H2ZM8 6H18V2H8V6ZM16.5 20C16.5 20 15.92 19.35 15.23 18.41C15.14 18.28 15.04 18.14 14.94 18C14 16.66 13 14.89 13 13.5C13 11.6 14.6 10 16.5 10C17.03 10 17.54 10.13 18 10.35C19.17 10.92 20 12.13 20 13.5C20 15.04 18.77 17.04 17.77 18.41C17.08 19.35 16.5 20 16.5 20ZM15.3 13.6C15.3 14.2 15.8 14.8 16.5 14.8C17.2 14.8 17.8 14.2 17.7 13.6C17.7 13 17.1 12.4 16.5 12.4C15.9 12.4 15.3 12.9 15.3 13.6Z"
              fill="white"
            />
          </svg>
          <p>Land Use</p>
        </div>
        <div
          className="details__filter-tool"
          onClick={() => setViewMode(viewModeArr[3])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M16.3802 10.1146C12.3699 10.1146 11.5104 9.25507 11.5104 5.24479C11.5104 1.23452 12.3699 0.375 16.3802 0.375C20.3905 0.375 21.25 1.23452 21.25 5.24479C21.25 9.25507 20.3905 10.1146 16.3802 10.1146ZM14.3117 8.18897C14.7657 8.28989 15.4181 8.34375 16.3802 8.34375C17.3424 8.34375 17.9947 8.28989 18.4488 8.18897C18.8828 8.09252 19.02 7.97815 19.0668 7.93137C19.1136 7.8846 19.2279 7.74734 19.3244 7.31335C19.4253 6.85926 19.4792 6.20694 19.4792 5.24479C19.4792 4.28264 19.4253 3.63033 19.3244 3.17623C19.2279 2.74225 19.1136 2.60499 19.0668 2.55821C19.02 2.51144 18.8828 2.39707 18.4488 2.30062C17.9947 2.1997 17.3424 2.14583 16.3802 2.14583C15.4181 2.14583 14.7657 2.1997 14.3117 2.30062C13.8777 2.39707 13.7404 2.51144 13.6936 2.55821C13.6469 2.60499 13.5325 2.74225 13.436 3.17623C13.3351 3.63033 13.2812 4.28264 13.2812 5.24479C13.2812 6.20694 13.3351 6.85926 13.436 7.31335C13.5325 7.74734 13.6469 7.8846 13.6936 7.93137C13.7404 7.97815 13.8777 8.09252 14.3117 8.18897Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M4.86979 21.625C0.859519 21.625 0 20.7655 0 16.7552C0 12.7449 0.859519 11.8854 4.86979 11.8854C8.88007 11.8854 9.73958 12.7449 9.73958 16.7552C9.73958 20.7655 8.88007 21.625 4.86979 21.625ZM1.92562 18.8238C1.8247 18.3697 1.77083 17.7174 1.77083 16.7552C1.77083 15.7931 1.8247 15.1407 1.92562 14.6867C2.02207 14.2527 2.13644 14.1154 2.18321 14.0686C2.22999 14.0219 2.36725 13.9075 2.80123 13.811C3.25533 13.7101 3.90764 13.6562 4.86979 13.6562C5.83194 13.6562 6.48426 13.7101 6.93835 13.811C7.37234 13.9075 7.5096 14.0219 7.55637 14.0686C7.60315 14.1154 7.71752 14.2527 7.81397 14.6867C7.91489 15.1407 7.96875 15.7931 7.96875 16.7552C7.96875 17.7174 7.91489 18.3697 7.81397 18.8238C7.71752 19.2578 7.60315 19.395 7.55637 19.4418C7.5096 19.4886 7.37234 19.6029 6.93835 19.6994C6.48426 19.8003 5.83194 19.8542 4.86979 19.8542C3.90764 19.8542 3.25533 19.8003 2.80123 19.6994C2.36725 19.6029 2.22999 19.4886 2.18321 19.4418C2.13644 19.395 2.02207 19.2578 1.92562 18.8238Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 5.24479C0 9.25507 0.859519 10.1146 4.86979 10.1146C8.88007 10.1146 9.73958 9.25507 9.73958 5.24479C9.73958 1.23452 8.88007 0.375 4.86979 0.375C0.859519 0.375 0 1.23452 0 5.24479ZM1.77083 5.24479C1.77083 6.20694 1.8247 6.85926 1.92562 7.31335C2.02207 7.74734 2.13644 7.8846 2.18321 7.93137C2.22999 7.97815 2.36725 8.09252 2.80123 8.18897C3.25533 8.28989 3.90764 8.34375 4.86979 8.34375C5.83194 8.34375 6.48426 8.28989 6.93835 8.18897C7.37234 8.09252 7.5096 7.97815 7.55637 7.93137C7.60315 7.8846 7.71752 7.74734 7.81397 7.31335C7.91489 6.85926 7.96875 6.20694 7.96875 5.24479C7.96875 4.28264 7.91489 3.63033 7.81397 3.17623C7.71752 2.74225 7.60315 2.60499 7.55637 2.55821C7.5096 2.51144 7.37234 2.39707 6.93835 2.30062C6.48426 2.1997 5.83194 2.14583 4.86979 2.14583C3.90764 2.14583 3.25533 2.1997 2.80123 2.30062C2.36725 2.39707 2.22999 2.51144 2.18321 2.55821C2.13644 2.60499 2.02207 2.74225 1.92562 3.17623C1.8247 3.63033 1.77083 4.28264 1.77083 5.24479Z"
              fill="white"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M11.5104 16.7552C11.5104 20.7655 12.3699 21.625 16.3802 21.625C20.3905 21.625 21.25 20.7655 21.25 16.7552C21.25 12.7449 20.3905 11.8854 16.3802 11.8854C12.3699 11.8854 11.5104 12.7449 11.5104 16.7552ZM13.2812 16.7552C13.2812 17.7174 13.3351 18.3697 13.436 18.8238C13.5325 19.2578 13.6469 19.395 13.6936 19.4418C13.7404 19.4886 13.8777 19.6029 14.3117 19.6994C14.7657 19.8003 15.4181 19.8542 16.3802 19.8542C17.3424 19.8542 17.9947 19.8003 18.4488 19.6994C18.8828 19.6029 19.02 19.4886 19.0668 19.4418C19.1136 19.395 19.2279 19.2578 19.3244 18.8238C19.4253 18.3697 19.4792 17.7174 19.4792 16.7552C19.4792 15.7931 19.4253 15.1407 19.3244 14.6867C19.2279 14.2527 19.1136 14.1154 19.0668 14.0686C19.02 14.0219 18.8828 13.9075 18.4488 13.811C17.9947 13.7101 17.3424 13.6562 16.3802 13.6562C15.4181 13.6562 14.7657 13.7101 14.3117 13.811C13.8777 13.9075 13.7404 14.0219 13.6936 14.0686C13.6469 14.1154 13.5325 14.2527 13.436 14.6867C13.3351 15.1407 13.2812 15.7931 13.2812 16.7552Z"
              fill="white"
            />
          </svg>
          <p>Activities Point</p>
        </div>
        <div
          className="details__filter-tool"
          onClick={() => setViewMode(viewModeArr[0])}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="22"
            viewBox="0 0 25 22"
            fill="none"
          >
            <path
              d="M5 5.44118C5 4.78594 5.26339 4.15753 5.73223 3.69421C6.20107 3.23088 6.83696 2.97059 7.5 2.97059C8.16304 2.97059 8.79893 3.23088 9.26777 3.69421C9.73661 4.15753 10 4.78594 10 5.44118C10 6.09642 9.73661 6.72482 9.26777 7.18815C8.79893 7.65147 8.16304 7.91176 7.5 7.91176C6.83696 7.91176 6.20107 7.65147 5.73223 7.18815C5.26339 6.72482 5 6.09642 5 5.44118ZM7.5 0.5C6.17392 0.5 4.90215 1.02059 3.96447 1.94724C3.02678 2.87389 2.5 4.13069 2.5 5.44118C2.5 6.75166 3.02678 8.00847 3.96447 8.93512C4.90215 9.86177 6.17392 10.3824 7.5 10.3824C8.82608 10.3824 10.0979 9.86177 11.0355 8.93512C11.9732 8.00847 12.5 6.75166 12.5 5.44118C12.5 4.13069 11.9732 2.87389 11.0355 1.94724C10.0979 1.02059 8.82608 0.5 7.5 0.5ZM17.5 6.67647C17.5 6.34885 17.6317 6.03465 17.8661 5.80299C18.1005 5.57132 18.4185 5.44118 18.75 5.44118C19.0815 5.44118 19.3995 5.57132 19.6339 5.80299C19.8683 6.03465 20 6.34885 20 6.67647C20 7.00409 19.8683 7.31829 19.6339 7.54995C19.3995 7.78162 19.0815 7.91176 18.75 7.91176C18.4185 7.91176 18.1005 7.78162 17.8661 7.54995C17.6317 7.31829 17.5 7.00409 17.5 6.67647ZM18.75 2.97059C17.7554 2.97059 16.8016 3.36103 16.0983 4.05602C15.3951 4.751 15 5.69361 15 6.67647C15 7.65933 15.3951 8.60194 16.0983 9.29693C16.8016 9.99191 17.7554 10.3824 18.75 10.3824C19.7446 10.3824 20.6984 9.99191 21.4017 9.29693C22.1049 8.60194 22.5 7.65933 22.5 6.67647C22.5 5.69361 22.1049 4.751 21.4017 4.05602C20.6984 3.36103 19.7446 2.97059 18.75 2.97059ZM0 15.9412C0 14.2365 1.4 12.8529 3.125 12.8529H11.875C13.6 12.8529 15 14.2365 15 15.9412V16.0598C14.9981 16.1498 14.9914 16.2397 14.98 16.3291C14.958 16.5455 14.9204 16.7602 14.8675 16.9714C14.6999 17.6551 14.3984 18.2997 13.98 18.8688C12.92 20.3092 10.945 21.5 7.5 21.5C4.055 21.5 2.08 20.3092 1.02 18.8688C0.471858 18.121 0.127501 17.2464 0.02 16.3291C0.00995323 16.2387 0.00328199 16.1481 0 16.0573V16.0178V15.9412ZM2.5 16.0054C2.51036 16.1353 2.53126 16.2642 2.5625 16.3908C2.63 16.67 2.7675 17.0431 3.0425 17.4161C3.5425 18.098 4.6925 19.0294 7.5 19.0294C10.305 19.0294 11.455 18.098 11.9575 17.4161C12.2601 17.0018 12.4472 16.5162 12.5 16.0079V15.9412C12.5 15.7774 12.4342 15.6203 12.3169 15.5044C12.1997 15.3886 12.0408 15.3235 11.875 15.3235H3.125C2.95924 15.3235 2.80027 15.3886 2.68306 15.5044C2.56585 15.6203 2.5 15.7774 2.5 15.9412V16.0054ZM18.7475 20.2647C17.9629 20.2724 17.1801 20.1895 16.415 20.0176C16.8721 19.3045 17.1964 18.5163 17.3725 17.6904C17.76 17.7546 18.215 17.7941 18.7475 17.7941C20.9725 17.7941 21.8175 17.1221 22.1475 16.7145C22.3309 16.4888 22.4516 16.2197 22.4975 15.9338V15.9214C22.4923 15.7611 22.4242 15.609 22.3075 15.4974C22.1909 15.3858 22.0349 15.3234 21.8725 15.3235H17.465C17.3664 14.4394 17.0534 13.5919 16.5525 12.8529H21.875C23.6 12.8529 25 14.2365 25 15.9412V15.9832C24.9978 16.06 24.992 16.1367 24.9825 16.2129C24.8832 16.9606 24.5789 17.6671 24.1025 18.2561C23.18 19.3926 21.5275 20.2647 18.75 20.2647"
              fill="white"
            />
          </svg>
          <p>Interview Point</p>
        </div>
      </div>
      <div className="details__show-info"></div>
    </>
  );
};

export default Details;
