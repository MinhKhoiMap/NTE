import { useEffect, useRef, useState } from "react";
import { Layer, Source, useMap } from "react-map-gl";
import * as turf from "@turf/turf";

// Data
import { landuseData } from "../../../../assets/data/landuse";
import InfoTable from "../../../../components/InfoTable/InfoTable";

const CaseLanduseValues = [
  "Housing Land",
  "#F6D776",
  "Office",
  "#87A7FC",
  "Public Infrastructure Land",
  "#FFD4D4",
  "Commercial buildings",
  "#30D05D",
  "Water",
  "#51E5FF",
  "Administrative BL",
  "#A8A196",
];

const Landuse = ({ site }) => {
  const tableMaxWidth = 300,
    tableMaxHeight = 350;

  const mouseDivRef = useRef();
  const { map } = useMap();

  const [infoTablePosition, setInfoTablePosition] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [infoTable, setInfoTable] = useState([]);

  useEffect(() => {
    function controlInfoTable(e) {
      setShowTable(true);

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

      if (mouseDivRef.current) {
        mouseDivRef.current.style.top = clientY + "px";
        mouseDivRef.current.style.left = clientX + "px";
      }

      setInfoTablePosition({
        px: { position: positionX, value: valueX + "px" },
        py: { position: positionY, value: valueY + "px" },
      });
    }

    function reset() {
      setShowTable(false);
      setInfoTablePosition(null);
    }

    map.on("mousemove", "landuse_selection", controlInfoTable);
    map.on("mouseleave", "landuse_selection", reset);

    return () => {
      map.off("mousemove", "landuse_selection", controlInfoTable);
      map.off("mouseleave", "landuse_selection", reset);
    };
  });

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

      <div className="fixed" ref={mouseDivRef}>
        {showTable && (
          <InfoTable
            infoList={infoTable}
            cx={infoTablePosition.px}
            cy={infoTablePosition.py}
            maxWidth={tableMaxWidth}
            maxHeight={tableMaxHeight}
          />
        )}
      </div>
    </>
  );
};

export default Landuse;
