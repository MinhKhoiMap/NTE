import { useState, useEffect, useRef } from "react";
import { Layer, Source, useMap } from "react-map-gl";

// Data
import { buildinguseData } from "../../../../assets/data/buildinguse";
import InfoTable from "../../../../components/InfoTable/InfoTable";

const CaseBuildinguseValues = [
  "Housing",
  "#FF9844",
  "Office",
  "#87A7FC",
  "Hotel",
  "#37B5B6",
  "Mixed-use",
  "#E6B9DE",
  "Administrative Buildings",
  "#92197F",
  "School/Institute",
  "#F6ECA9",
  "Tourist/Attraction Point",
  "#D71313",
];

const Buildinguse = ({ site }) => {
  const tableMaxWidth = 200,
    tableMaxHeight = 250;

  const mouseDivRef = useRef();
  const { map } = useMap();

  const [infoTablePosition, setInfoTablePosition] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const [infoTable, setInfoTable] = useState([]);

  useEffect(() => {
    function controlInfoTable(e) {
      setShowTable(true);

      setInfoTable([
        { title: "Building use", content: e.features[0].properties.Buildsused },
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

    map.on("mousemove", "buildinguse_selection", controlInfoTable);
    map.on("mouseleave", "buildinguse_selection", reset);

    return () => {
      map.off("mousemove", "buildinguse_selection", controlInfoTable);
      map.off("mouseleave", "buildinguse_selection", reset);
      console.log("wtf");
    };
  });

  return (
    <>
      <Source type="geojson" data={buildinguseData[site]}>
        <Layer
          id="buildinguse_selection"
          type="fill"
          paint={{
            "fill-outline-color": "pink",
            "fill-color": [
              "match",
              ["get", "Buildsused"],
              ...CaseBuildinguseValues,
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

export default Buildinguse;
