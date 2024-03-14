import { Marker, Source } from "react-map-gl";

// Data
import { interviewPointData } from "../../../assets/data/interview";

const Interview = ({ site }) => {
  return (
    <>
      <Source type="geojson" data={interviewPointData[site]}>
        {interviewPointData[site].features.map((feature, index) => {
          return (
            <Marker
              key={index}
              longitude={feature.geometry.coordinates[0]}
              latitude={feature.geometry.coordinates[1]}
            ></Marker>
          );
        })}
      </Source>
    </>
  );
};

export default Interview;
