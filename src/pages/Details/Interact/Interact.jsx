import { useState } from "react";

import Landuse from "./Landuse/Landuse";
import Buildinguse from "./Buildinguse/Buildinguse";
import Activities from "./Activities/Activities";
import Interview from "./Interview/Interview";

const filterModeArr = ["interview", "landuse", "buildinguse", "activities"];

const Interact = ({ siteIndex }) => {
  const [filterMode, setFilterMode] = useState(filterModeArr[0]);

  return (
    <>
      <div className="details__filter">
        <div
          className={`details__filter-tool ${
            filterMode === filterModeArr[2] && "details__filter-tool--active"
          }`}
          onClick={() => setFilterMode(filterModeArr[2])}
        >
          <p>Building Use</p>
        </div>
        <div
          className={`details__filter-tool ${
            filterMode === filterModeArr[1] && "details__filter-tool--active"
          }`}
          onClick={() => setFilterMode(filterModeArr[1])}
        >
          <p>Land Use</p>
        </div>
        <div
          className={`details__filter-tool ${
            filterMode === filterModeArr[3] && "details__filter-tool--active"
          }`}
          onClick={() => setFilterMode(filterModeArr[3])}
        >
          <p>Activities Point</p>
        </div>
        <div
          className={`details__filter-tool ${
            filterMode === filterModeArr[0] && "details__filter-tool--active"
          }`}
          onClick={() => setFilterMode(filterModeArr[0])}
        >
          <p>Interview Point</p>
        </div>
      </div>
      {filterMode === filterModeArr[1] && <Landuse site={siteIndex} />}

      {filterMode === filterModeArr[2] && <Buildinguse site={siteIndex} />}

      {filterMode === filterModeArr[3] && <Activities site={siteIndex} />}

      {filterMode === filterModeArr[0] && siteIndex && (
        <Interview site={siteIndex} />
      )}
    </>
  );
};

export default Interact;
