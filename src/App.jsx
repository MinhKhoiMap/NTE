import mapboxgl from "mapbox-gl";
import { Map } from "react-map-gl";
import { useRef, useContext, useCallback, useState, useEffect } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { initialViewState } from "./contexts/initialViewContext";

// Import utils
import "mapbox-gl/dist/mapbox-gl.css";
import "./App.css";

// Import components
import HomePage from "./pages/HomePage/HomePage";
import SiteSelection from "./pages/SiteSelection/SiteSelection";
import Details from "./pages/Details/Details";
import Test from "./pages/Test/Test";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVsbG9pYW1raG9pIiwiYSI6ImNscWtoODB0MzIyeTEybm1rc2l1YWg0bm8ifQ.wOn1q83oPkWNJBap0KFrWQ";

function App() {
  const initialView = useContext(initialViewState);
  const map = useRef(null);
  const secondsPerRevolution = 120;
  // Above zoom level 5, do not rotate.
  const maxSpinZoom = 5;
  // Rotate at intermediate speeds between zoom levels 3 and 5.
  const slowSpinZoom = 3;

  const [userInteract, setUserInteract] = useState(false);

  const spinGlobe = () => {
    const zoom = map.current.getMap().getZoom();

    if (!userInteract && zoom < maxSpinZoom) {
      let distancePerSecond = 360 / secondsPerRevolution;
      if (zoom > slowSpinZoom) {
        // Slow spinning at higher zooms
        const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom);
        distancePerSecond *= zoomDif;
      }
      const center = map.current.getMap().getCenter();
      center.lng += distancePerSecond;

      // Smoothly animate the map over one second.
      // When this animation is complete, it calls a 'moveend' event.
      map.current.easeTo({
        center,
        duration: 1000,
        easing: (n) => n,
      });
    }
  };

  useEffect(() => {
    if (map.current) spinGlobe();
  }, [userInteract]);

  return (
    <div className="w-screen h-screen relative">
      <Map
        id="map"
        ref={map}
        mapboxAccessToken={mapboxgl.accessToken}
        initialViewState={initialView}
        projection="globe"
        onLoad={spinGlobe}
        onMoveEnd={spinGlobe}
        onMouseDown={() => {
          setUserInteract(true);
        }}
        onMouseUp={() => {
          setUserInteract(false);
          spinGlobe();
        }}
        onDragEnd={() => {
          setUserInteract(false);
          spinGlobe();
        }}
        logoPosition="top-right"
        mapStyle="mapbox://styles/mapbox/dark-v11"
        attributionControl={false}
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nha_trang" element={<SiteSelection />}>
            <Route path="/nha_trang/:site" element={<Details />} />
          </Route>
          <Route path="/about_project" element={<Test />} />
        </Routes>
      </Map>
      <div className="fixed bottom-2 left-[25px] about-project__container">
        <Link className="text-white mt-5 block" to="/about_project">
          <span className="inline-block">About Project</span>
        </Link>
      </div>
    </div>
  );
}

export default App;
