import { Layer, Source } from "react-map-gl";

// Data
import { landuseData } from "../../../assets/data/landuse";

const CaseLanduseValues = [
  "Housing Land",
  "#fbe200",
  "Office",
  "#efa580",
  "Public Infrastructure Land",
  "#e33019",
  "Commercial Buildings",
  "#eea6b8",
];

const Landuse = ({ site }) => {
  return (
    <>
      <Source type="geojson" data={landuseData[site]} generateId={true}>
        <Layer
          id="landuse_selection"
          type="fill"
          paint={{
            "fill-outline-color": "pink",
            "fill-color": [
              "match",
              ["get", "Landuse"],
              ...CaseLanduseValues,
              // Other Values
              "rgba(255, 196, 54, 0.3)",
            ],
          }}
        />
      </Source>
    </>
  );
};

export default Landuse;
