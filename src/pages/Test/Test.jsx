import { Layer, Source, useMap } from "react-map-gl";
import { siteSelectionData } from "../../assets/data/site";
import { useEffect } from "react";

import pdf from "../../assets/posts/Maplanduse.pdf";

const Test = () => {
  let flying = false;
  const { map } = useMap();

  useEffect(() => {
    map.flyTo({
      center: [109.20182482281035, 12.246813094956494],
      essential: true, // this animation is considered essential with respect to prefers-reduced-motion
      zoom: 13,
      speed: 1.2,
    });
  }, [map]);

  useEffect(() => {
    map.on("click", "site_selection", (e) => {
      // console.log(map.queryRenderedFeatures(e.point)[0].geometry.coordinates);
      console.log(e.features[0]);
    });
  });

  return (
    <>
      <object data={pdf} type=""></object>
    </>
  );
};

export default Test;
