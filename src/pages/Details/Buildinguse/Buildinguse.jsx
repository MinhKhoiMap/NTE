import { Layer, Source } from "react-map-gl";

// Data
import { buildinguseData } from "../../../assets/data/buildinguse";

const Buildinguse = ({ site }) => {
  return (
    <>
      <Source type="geojson" data={buildinguseData[site]}>
        <Layer
          type="fill"
          paint={{
            "fill-color": "rgba(255, 196, 54, 0.3)",
            "fill-outline-color": "pink",
          }}
        />
      </Source>
    </>
  );
};

export default Buildinguse;
