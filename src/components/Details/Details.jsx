import React, { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import mapboxgl from "mapbox-gl";
import { Layer, Marker, Source, useMap } from "react-map-gl";

import "./Details.css";
import { interviewPointData } from "../../assets/data/interview";
import { siteSelectionData } from "../../assets/data/site";

const Details = () => {
  const [siteIndex] = useOutletContext();
  const { map } = useMap();

  useEffect(() => {
    var siteBounds = new mapboxgl.LngLatBounds();
    var siteMinLat = 90,
      siteMaxLat = -90,
      siteMinLng = 180,
      siteMaxLng = -180;

    // console.log(
    //   interviewPointData[siteIndex],
    //   siteSelectionData.features[siteIndex]
    // );

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

    map.getMap().fitBounds(siteBounds, {
      padding: { top: 20, bottom: 20, left: 20, right: 20 },
    });
  });

  return (
    <>
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
      <div className="details__navbar">
        <div>Area name</div>
        <div>Overview</div>
        <div>Project</div>
        <div>Interact</div>
      </div>
    </>
  );
};

export default Details;
