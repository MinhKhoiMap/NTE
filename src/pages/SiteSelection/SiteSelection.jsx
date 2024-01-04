import { useEffect } from "react";
import mapboxgl from "mapbox-gl";

import { siteSelectionData } from "../../assets/data/site";

const SiteSelection = ({ map }) => {
  useEffect(() => {
    if (map) {
      console.log("hehe boiz");
      map.flyTo({
        center: [109.20182482281035, 12.246813094956494],
        essential: true, // this animation is considered essential with respect to prefers-reduced-motion
        zoom: 13,
        speed: 1.2,
      });

      if (map.isStyleLoaded()) map.once("render", handleLoadSite);
      else map.on("load", handleLoadSite);

      return () => {
        if (
          map.getLayer("map_background") &&
          map.getLayer("line_site") &&
          map.getLayer("site_background") &&
          map.getSource("site_selection")
        ) {
          map.removeLayer("map_background");
          map.removeLayer("line_site");
          map.removeLayer("site_background");
          map.removeSource("site_selection");
          console.log("clean up useEffect");
        }
      };
    }
  }, [map]);

  function handleLoadSite() {
    map.addSource("site_selection", {
      type: "geojson",
      data: siteSelectionData,
    });

    map.addLayer({
      id: "line_site",
      source: "site_selection",
      type: "line",
      layout: {},
      paint: {
        "line-color": "#000",
        "line-width": 4,
      },
    });

    map.addLayer({
      id: "map_background",
      type: "background",
      layout: {},
      paint: {
        "background-color": "rgba(0,0,0,0.5)",
      },
    });

    map.addLayer({
      id: "site_background",
      type: "fill",
      source: "site_selection",
      layout: {},
      paint: {
        "fill-color": "rgba(255,255,255,0.7)",
      },
    });

    map.on("mouseenter", "site_background", (e) => {
      map.doubleClickZoom.disable();
    });

    map.on("mouseleave", "site_background", (e) => {
      map.doubleClickZoom.enable();
    });

    siteSelectionData.features.forEach((site) => {
      console.log(site);
    });
  }

  return null;
};

export default SiteSelection;
