import mapboxgl from "mapbox-gl";
import { useState, useRef, useEffect, useContext } from "react";
import { Route, Routes } from "react-router-dom";
import { initialViewState } from "./contexts/initialViewContext";

// Import utils
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

// Import components
import HomePage from "./pages/HomePage/HomePage";
import SiteSelection from "./pages/SiteSelection/SiteSelection";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVsbG9pYW1raG9pIiwiYSI6ImNscWtoODB0MzIyeTEybm1rc2l1YWg0bm8ifQ.wOn1q83oPkWNJBap0KFrWQ";

function App() {
  const initialView = useContext(initialViewState);

  const secondsPerRevolution = 120;
  // Above zoom level 5, do not rotate.
  const maxSpinZoom = 5;
  // Rotate at intermediate speeds between zoom levels 3 and 5.
  const slowSpinZoom = 3;

  const mapContainer = useRef(null);
  const map = useRef(null);

  const [spinEnabled, setSpinEnabled] = useState(true);
  const [userInteracting, setUserInteracting] = useState(false);
  const [mapRef, setMapRef] = useState(null);

  function spinGlobe(_, state = false) {
    const zoom = map.current.getZoom();
    console.log(userInteracting, state, "spin globe");

    if (spinEnabled && !userInteracting && !state && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        // Slow spinning at higher zooms
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.current.getCenter();
      center.lng += distancePerSecond;
      // Smoothly animate the map over one second.
      // When this animation is complete, it calls a 'moveend' event.
      map.current.easeTo({
        center,
        duration: 1000,
        easing: (n) => n,
      });
    }
  }

  useEffect(() => {
    if (map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [initialView.lng, initialView.lat],
      projection: "globe",
      zoom: initialView.zoom,
      language: "en",
    });

    setMapRef(map.current);

    spinGlobe();

    // map.current.on("dragend", () => {
    //   setUserInteracting(false);
    //   spinGlobe();
    // });

    // map.current.on("pitchend", () => {
    //   setUserInteracting(false);
    //   spinGlobe();
    // });

    // map.current.on("rotateend", () => {
    //   setUserInteracting(false);
    //   spinGlobe();
    // });
  });

  useEffect(() => {
    if (map.current) {
      map.current.on("moveend", spinGlobe);
      map.current.on("mousedown", () => {
        setUserInteracting(true);
        console.log("mouse down");
      });

      map.current.on("mouseup", () => {
        console.log("mouse up");
        setUserInteracting(false);
        spinGlobe();
      });
    }

    return () => {
      console.log("why");
      map.current.off("moveend", spinGlobe);
      map.current.off("mousedown");
      map.current.off("mouseup");
    };
  });

  return (
    <div className="App w-screen h-screen relative">
      <div id="map" className="w-full h-full" ref={mapContainer} />
      <Routes>
        <Route path="/" element={<HomePage map={mapRef} />} />
        <Route path="/nha_trang" element={<SiteSelection map={mapRef} />} />
      </Routes>
    </div>
  );
}

export default App;
