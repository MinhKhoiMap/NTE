import { useRef, useState, useEffect } from "react";
import { Player } from "@lordicon/react";

// Asset
import bookmark from "../../assets/images/bookmark.json";

const AnnotationTable = ({ items, filter, setFilter }) => {
  const [filterState, setFilterState] = useState(0);
  const [filterItem, setFilterItem] = useState(null);

  const filter_btn = useRef();

  const handleFilterBuilding = (building) => {
    if (building === filter) {
      setFilterState(-1);
      setFilter(null);
      return null;
    }
    setFilterState(1);
    setFilterItem(building);
    setFilter(building);
  };

  useEffect(() => {
    if ([1, -1].includes(filterState)) filter_btn.current?.play();
  }, [filterState]);

  return (
    <div className="fixed bottom-24 right-6 gap-4 flex justify-around bg-white/15 px-2 py-3 rounded-lg">
      <div className="max-w-[50%] flex flex-col">
        {items.slice(0, items.length / 2 + 1).reduce((elArr, color, index) => {
          if (/^#[0-9A-F]{6}$/i.test(color)) {
            elArr.push(
              <div
                className="flex gap-2 items-center shrink grow basis-0 text-white hover:text-[color:var(--color)]  cursor-pointer"
                style={{ "--color": color }}
                key={items[index - 1]}
                onClick={() => handleFilterBuilding(items[index - 1])}
              >
                <span
                  className="inline-block w-2 h-2 rounded-full shrink-0 basis-auto cursor-pointer relative"
                  style={{
                    background: filterItem !== items[index - 1] && color,
                    width: "8px !important",
                  }}
                >
                  {filterItem === items[index - 1] && (
                    <div className="absolute -right-1 -top-1">
                      <Player
                        size={18}
                        colorize={color}
                        ref={filter_btn}
                        onComplete={() => {
                          if (filterState === -1) {
                            setTimeout(() => {
                              setFilterItem(null);
                            }, 200);
                          }
                        }}
                        onReady={() => {
                          filter_btn.current?.play();
                        }}
                        icon={bookmark}
                        direction={filterState}
                      />
                    </div>
                  )}
                </span>
                <p className="text-inherit/75 text-[12px] break-words">
                  {items[index - 1]}
                </p>
              </div>
            );
          }

          return elArr;
        }, [])}
      </div>
      <div className="max-w-[50%] flex gap-2 flex-col justify-between">
        {items
          .slice(items.length / 2, items.length)
          .reduce((elArr, color, index) => {
            if (/^#[0-9A-F]{6}$/i.test(color) && index > 0) {
              elArr.push(
                <div
                  className="flex gap-2 items-center shrink grow basis-0 text-white hover:text-[color:var(--color)]  cursor-pointer"
                  style={{ "--color": color }}
                  key={items[items.length / 2 + index - 1]}
                  onClick={() =>
                    handleFilterBuilding(items[items.length / 2 + index - 1])
                  }
                >
                  <span
                    className="inline-block w-2 h-2 rounded-full shrink-0 basis-auto cursor-pointer relative"
                    style={{
                      background:
                        filterItem !== items[items.length / 2 + index - 1] &&
                        color,
                      width: "8px !important",
                    }}
                  >
                    {filterItem === items[items.length / 2 + index - 1] && (
                      <div className="absolute -right-1 -top-1">
                        <Player
                          size={18}
                          colorize={color}
                          ref={filter_btn}
                          onComplete={() => {
                            if (filterState === -1) {
                              setTimeout(() => {
                                setFilterItem(null);
                              }, 200);
                            }
                          }}
                          onReady={() => {
                            filter_btn.current?.play();
                          }}
                          icon={bookmark}
                          direction={filterState}
                        />
                      </div>
                    )}
                  </span>
                  <p className="text-inherit/75 text-[12px] break-words">
                    {items[items.length / 2 + index - 1]}
                  </p>
                </div>
              );
            }

            return elArr;
          }, [])}
      </div>
    </div>
  );
};

export default AnnotationTable;
