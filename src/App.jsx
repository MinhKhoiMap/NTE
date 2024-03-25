import mapboxgl from "mapbox-gl";
import { Map } from "react-map-gl";
import { useRef, useContext, useCallback } from "react";
import { Route, Routes } from "react-router-dom";
import { initialViewState } from "./contexts/initialViewContext";

// Import utils
import "mapbox-gl/dist/mapbox-gl.css";
import "./index.css";

// Import components
import HomePage from "./pages/HomePage/HomePage";
import SiteSelection from "./pages/SiteSelection/SiteSelection";
import Details from "./pages/Details/Details";
import Test from "./pages/Test/Test";

mapboxgl.accessToken =
  "pk.eyJ1IjoiaGVsbG9pYW1raG9pIiwiYSI6ImNscWtoODB0MzIyeTEybm1rc2l1YWg0bm8ifQ.wOn1q83oPkWNJBap0KFrWQ";

function App() {
  const initialView = useContext(initialViewState);
  const map = useRef();
  const secondsPerRevolution = 120;
  // Above zoom level 5, do not rotate.
  const maxSpinZoom = 5;
  // Rotate at intermediate speeds between zoom levels 3 and 5.
  const slowSpinZoom = 3;

  const spinGlobe = useCallback(() => {
    const zoom = map.current.getMap().getZoom();

    if (zoom < maxSpinZoom) {
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
  }, [map]);

  return (
    <div className="App w-screen h-screen relative">
      <Map
        id="map"
        ref={map}
        mapboxAccessToken={mapboxgl.accessToken}
        initialViewState={initialView}
        projection="globe"
        onLoad={spinGlobe}
        onMoveEnd={spinGlobe}
        mapStyle="mapbox://styles/mapbox/dark-v11"
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/nha_trang" element={<SiteSelection />}>
            <Route path="/nha_trang/:site" element={<Details />} />
          </Route>
          {/* <Route path="/test" element={<Test />} /> */}
        </Routes>
      </Map>
    </div>
  );
}

export default App;
