import { useEffect, useState } from "react";
import { Layer, Marker, Source, useMap } from "react-map-gl";

// Data
import { interviewPointData } from "../../../../assets/data/interview";

import locate from "../../../../assets/images/locate.png";
import ImageSlider from "../../../../components/ImageSlider/ImageSlider";

const urlImageArr = [
  "https://images.ctfassets.net/ub3bwfd53mwy/6atCoddzStFzz0RcaztYCh/1c3e8a37eebe3c6a435038f8d9eef7f3/3_Image.jpg?w=750",
  "https://media.tenor.com/dimT0JAAMb4AAAAM/cat-cute.gif",
  "https://www.ibm.com/content/dam/connectedassets-adobe-cms/worldwide-content/stock-assets/getty/image/photography/6b/88/dsc02281-edit-edit-5-edit.component.xl.ts=1710427027510.jpg/content/adobe-cms/us/en/topics/ai-hallucinations/_jcr_content/root/leadspace",
];

const Interview = ({ site }) => {
  const { map } = useMap();

  const [showImageGallery, setShowImageGallery] = useState(false);

  useEffect(() => {
    map.loadImage(locate, (err, image) => {
      if (err) throw err;

      if (!map.hasImage("locate")) {
        map.addImage("locate", image);
      }
    });

    map.on("click", "interview_point", (e) => {
      setShowImageGallery(true);
    });
  }, []);

  return (
    <>
      <Source type="geojson" data={interviewPointData[site]}>
        <Layer
          id="interview_point"
          type="symbol"
          layout={{
            "icon-image": "locate",
            "icon-size": 1,
            // "icon-allow-overlap": true,
          }}
        />
      </Source>

      {showImageGallery && (
        <div
          className="fixed z-[9999] top-0 bottom-0 left-0 right-0 bg-black/95"
          onClick={() => setShowImageGallery(false)}
        >
          <div
            className="absolute w-[90%] h-[90%] top-1/2 -translate-x-1/2 left-1/2 -translate-y-1/2"
            onClick={(e) => e.stopPropagation()}
          >
            <ImageSlider imgArr={urlImageArr} />
          </div>
        </div>
      )}
    </>
  );
};

export default Interview;
