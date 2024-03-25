import { useCallback, useEffect, useState } from "react";
import { Layer, Marker, Source, useMap } from "react-map-gl";
import { Outlet, useNavigate } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import polylabel from "@mapbox/polylabel";

import "./SiteSelection.css";

import { siteSelectionData } from "../../assets/data/site";
import Button from "../../components/Button/Button";
import Details from "../Details/Details";

const SiteSelection = () => {
  const [mapBounds, setMapBounds] = useState(null);
  const [siteChosenIndex, setSiteChosenIndex] = useState(null);

  const { map } = useMap();
  const navigate = useNavigate();

  useEffect(() => {
    map.flyTo({
      center: [109.20182482281035, 12.246813094956494],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 13,
      speed: 1.2,
    });
    // map.getMap().fire("flystart");

    handleLoadSite();

    // map.getMap().on("flystart", () => {
    //   flying = true;
    // });

    // map.getMap().on("flyend", () => {
    //   flying = false;
    // });

    // map.getMap().once("moveend", () => {
    //   if (flying) {
    //     setIsShowMarker(true);
    //     map.getMap().fire("flyend");
    //   }
    // });
  }, [map]);

  const handleLoadSite = useCallback(() => {
    var bounds = new mapboxgl.LngLatBounds();
    let minLat = 90,
      maxLat = -90,
      minLng = 180,
      maxLng = -180;

    siteSelectionData.features.forEach((feature) => {
      feature.geometry.coordinates[0].forEach((coordinate) => {
        maxLat = Math.max(coordinate[1], maxLat);
        minLat = Math.min(coordinate[1], minLat);
        maxLng = Math.max(coordinate[0], maxLng);
        minLng = Math.min(coordinate[0], minLng);
      });
    });

    bounds.extend([
      [maxLng, maxLat],
      [minLng, minLat],
    ]);

    setMapBounds(bounds);

    map.fitBounds(bounds, {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    });
  }, [map]);

  const siteLayerHandler = useCallback(
    (name, feature, id) => {
      map.on("click", `fill_${name}`, (e) => {
        setSiteChosenIndex(id);
        navigate(`./${id}`);
      });

      map.on("mouseenter", `fill_${name}`, (e) => {
        map.getMap().doubleClickZoom.disable();
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", `fill_${name}`, (e) => {
        map.getMap().doubleClickZoom.enable();
        map.getCanvas().style.cursor = "grab";
      });

      map.on("dragstart", `fill_${name}`, (e) => {
        map.getCanvas().style.cursor = "grab";
      });

      map.on("dragend", `fill_${name}`, (e) => {
        map.getCanvas().style.cursor = "cursor";
      });
    },
    [map]
  );

  const handleReStart = () => {
    setSiteChosenIndex(null);
    navigate("./");
    map.fitBounds(mapBounds, {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    });
  };

  return (
    <>
      <Button
        label="Center"
        icon={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="34"
            height="18"
            viewBox="0 0 34 18"
            fill="none"
          >
            <path
              d="M6.47145 9.72998C7.90229 7.31283 10.0878 5.43285 12.6917 4.37936C15.2956 3.32587 18.1735 3.15726 20.8825 3.89947C23.5916 4.64168 25.9817 6.25358 27.685 8.48711C29.3884 10.7206 30.3105 13.452 30.3095 16.2609C30.3095 16.714 30.4895 17.1485 30.8099 17.4689C31.1303 17.7893 31.5648 17.9693 32.0179 17.9693C32.4709 17.9693 32.9055 17.7893 33.2258 17.4689C33.5462 17.1485 33.7262 16.714 33.7262 16.2609C33.7264 12.825 32.6362 9.4777 30.6124 6.701C28.5887 3.92432 25.7359 1.86156 22.4649 0.809791C19.194 -0.241975 15.6736 -0.228472 12.4108 0.848356C9.14795 1.92518 6.31108 4.00977 4.3087 6.8019L3.39133 1.60003C3.31272 1.15374 3.06005 0.756968 2.68889 0.496984C2.31774 0.237 1.85851 0.135104 1.41222 0.213713C0.965942 0.292322 0.569166 0.544997 0.309182 0.916151C0.0491981 1.2873 -0.0526973 1.74654 0.0259117 2.19282L1.806 12.2874C1.88521 12.7335 2.13838 13.1298 2.50983 13.3892C2.75189 13.5516 3.02838 13.6553 3.31746 13.6924C3.60654 13.7295 3.90028 13.6988 4.17545 13.6028L13.8788 11.8927C14.3251 11.8141 14.7218 11.5615 14.9818 11.1903C15.2418 10.8191 15.3437 10.3599 15.2651 9.91363C15.1865 9.46735 14.9338 9.07057 14.5627 8.81059C14.1915 8.5506 13.7323 8.44871 13.286 8.52732L6.47145 9.72998Z"
              fill="#FFC436"
            />
          </svg>
        }
        onClick={handleReStart}
        reverseIcon={true}
        styleButtonOpts={{
          bottom: "37px",
          left: "50%",
          transform: "translateX(-55%)",
          fontWeight: "600",
          padding: "20px",
          background: "none",
          border: "1px solid #FFC436",
          boxShadow: "2px 2px 4px 0px rgba(255, 255, 255, 0.50)",
        }}
      />

      {siteSelectionData.features.map((feature, index) => {
        let name = `site_${feature.name}`;
        const polyLabelLngLat = polylabel(feature.geometry.coordinates);

        useEffect(() => {
          siteLayerHandler(name, feature, index);

          return () => {
            map.off("click", `fill_${name}`);
            map.off("mouseenter", `fill_${name}`);
            map.off("mouseleave", `fill_${name}`);
            map.off("dragstart", `fill_${name}`);
            map.off("dragend", `fill_${name}`);
          };
        }, []);

        return (
          <Source key={name} id={name} type="geojson" data={feature.geometry}>
            <Layer
              type="line"
              paint={{
                "line-color": "#fff",
                "line-width": 0.4,
              }}
            />
            <Layer
              id={`fill_${name}`}
              type="fill"
              paint={{ "fill-color": "rgba(13, 16, 92, 0.3)" }}
            />

            {/* {siteChosenIndex !== "name" && isShowMarker && (
              <Marker
                longitude={polyLabelLngLat[0]}
                latitude={polyLabelLngLat[1]}
              >
                <div className={`marker`}>
                  <div className="pin">
                    <div className="label">{feature.name}</div>
                  </div>
                  <div className="pulse"></div>
                </div>
              </Marker>
            )} */}
          </Source>
        );
      })}

      <Outlet context={[siteChosenIndex || 0]} />
    </>
  );
};

export default SiteSelection;
