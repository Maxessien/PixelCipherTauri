import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaArrowsRotate } from "react-icons/fa6";
import { MdFilterList } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSearchQuery, setSort } from "../../../store/slices/imagesSlice";
import { ImagesSort } from "../../../types";
import Button from "../../reusable/Button";

const HomeHeader = ({ refreshFn }: { refreshFn: () => void }) => {
  const { search, sort } = useAppSelector((state) => state.images);
  const [showSort, setShowSort] = useState(false);
  const dispatch = useAppDispatch();

  const changeSort = (type: ImagesSort) => {
    dispatch(setSort(type));
    setShowSort(false);
  };

  const sortStyles = (type: ImagesSort) =>
    (type !== sort
      ? "hover:bg-(--main-tertiary)"
      : "bg-(--main-primary) hover:brightness-95") +
    " w-full transition-all rounded-md px-3 py-2";

    const sortMappings: Record<ImagesSort, string> = {
      alpha: "A-Z",
      de_alpha: "Z-A",
      newest: "Newest First",
      oldest: "Oldest First",
      small: "Smallest First",
      large: "Largest First",
    };

  return (
    <header className="space-y-2">
      <div className="flex justify-between items-center gap-2">
        <h2 className="text-left text-xl sm:text-2xl font-semibold">
          Select Image To Encode or Decode
        </h2>
        <Button rounded="rounded-md" attrs={{ onClick: refreshFn }}>
          <span className="sm:mr-2 py-1.5 sm:py-0">
            <FaArrowsRotate />
          </span>
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </div>
      <div className="w-full relative flex gap-3 justify-between items-center">
        <div className="flex-1 relative max-w-120">
          <input
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            value={search}
            type="text"
            className="w-full text-lg font-medium py-1 pl-9 pr-2 shadow-[inset_0px_0px_10px_-6px_var(--text-primary-light)] rounded-md"
          />
          <button className="p-2 text-base font-medium absolute -translate-y-1/2 top-1/2 left-1 sm:left-2">
            <FaSearch />
          </button>
        </div>
        <div>
          <button
            onClick={() => setShowSort(!showSort)}
            className="px-3 py-2 shadow-[inset_0px_0px_10px_-6px_var(--text-primary-light)] flex gap-2 rounded-md justify-center items-center font-medium"
          >
            <MdFilterList size={25} />{" "}
            <span className="hidden sm:inline text-base md:text-lg">
              {sortMappings?.[sort] || "N/A"}
            </span>
          </button>
        </div>
        {showSort && (
          <div className="px-1.5 py-1 flex flex-col gap-2 absolute top-[calc(100%+10px)] right-0 shadow-[0px_0px_10px_-6px_var(--text-primary-light)] text-base md:text-lg font-medium bg-(--main-secondary) rounded-md">
            <button
              className={sortStyles("alpha")}
              onClick={() => changeSort("alpha")}
            >
              A-Z
            </button>
            <button
              className={sortStyles("de_alpha")}
              onClick={() => changeSort("de_alpha")}
            >
              Z-A
            </button>
            <button
              className={sortStyles("newest")}
              onClick={() => changeSort("newest")}
            >
              Newest First
            </button>
            <button
              className={sortStyles("oldest")}
              onClick={() => changeSort("oldest")}
            >
              Oldest First
            </button>
            <button
              className={sortStyles("small")}
              onClick={() => changeSort("small")}
            >
              Smallest First
            </button>
            <button
              className={sortStyles("large")}
              onClick={() => changeSort("large")}
            >
              Largest First
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default HomeHeader;
