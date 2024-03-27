import { Layer, Source, useMap } from "react-map-gl";
import { siteSelectionData } from "../../assets/data/site";
import { useEffect } from "react";

import pdf from "../../assets/posts/Maplanduse.pdf";
import ImageSlider from "../../components/ImageSlider/ImageSlider";

const urlImageArr = [
  "https://images.ctfassets.net/ub3bwfd53mwy/6atCoddzStFzz0RcaztYCh/1c3e8a37eebe3c6a435038f8d9eef7f3/3_Image.jpg?w=750",
  "https://media.tenor.com/dimT0JAAMb4AAAAM/cat-cute.gif",
];

const Test = () => {
  return (
    <div className="fixed top-0 bottom-0 left-0 right-0">
      {/* <object data={pdf} type=""></object> */}
      <ImageSlider imgArr={urlImageArr} />
    </div>
  );
};

export default Test;
