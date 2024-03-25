import { Marker, Source } from "react-map-gl";

// Data
import { activitiesData } from "../../../../assets/data/activities";

const Activities = ({ site }) => {
  return (
    <>
      <Source type="geojson" data={activitiesData[site]}>
        {activitiesData[site].features.map((feature, index) => {
          return (
            <Marker
              key={index}
              longitude={feature.geometry.coordinates[0][0]}
              latitude={feature.geometry.coordinates[0][1]}
            >
              <div>
                <div className="w-[20px] h-[20px] rounded-full bg-[#191d88] border border-[#000]"></div>
              </div>
            </Marker>
          );
        })}
      </Source>
    </>
  );
};

export default Activities;
