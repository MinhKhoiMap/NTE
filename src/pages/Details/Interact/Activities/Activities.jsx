import { useEffect, useState } from "react";
import { Layer, Marker, Source, useMap } from "react-map-gl";

// Data
import { activitiesData } from "../../../../assets/data/activities";
import AnnotationTable from "../../../../components/AnnotationTable/AnnotationTable";

const CaseActivitiesValues = [
  "Entertainment",
  "#FB7A78",
  "F&B",
  "#FFDE03",
  "Market",
  "#8200D2",
  "misc.",
  "#560764",
  "Art & Craft",
  "#FF935C",
  "Mixed-use",
  "#E6B9DE",
  "Clothes & Fashion",
  "#95EFFF",
  "Wellness",
  "#3081D0",
];

const Activities = ({ site }) => {
  const { map } = useMap();

  const [filterActivities, setFilterActivities] = useState(null);

  useEffect(() => {
    map.on("click", "activities_point", (e) => {
      console.log(e.features[0]);
    });
  }, []);

  return (
    <>
      <Source type="geojson" data={activitiesData[site]}>
        <Layer
          id="activities_point"
          type="circle"
          paint={{
            "circle-stroke-color": "white",
            "circle-stroke-width": 1,
            "circle-radius": 6,
            "circle-color": [
              "match",
              ["get", "item_1"],
              ...CaseActivitiesValues,
              // Other Values
              "rgba(255, 196, 54, 0.3)",
            ],
          }}
          filter={
            filterActivities
              ? ["==", ["get", "item_1"], filterActivities]
              : ["!=", ["get", "item_1"], null]
          }
        />
      </Source>

      <AnnotationTable
        items={CaseActivitiesValues}
        filter={filterActivities}
        setFilter={setFilterActivities}
      />
    </>
  );
};

export default Activities;
