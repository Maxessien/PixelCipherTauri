import { FaSearch } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSearchQuery, setSort } from "../../../store/slices/imagesSlice";
import { ImagesSort } from "../../../types";

const HomeHeader = () => {
    const {search, sort} = useAppSelector(state=>state.images)
    const dispatch = useAppDispatch()
  return (
    <header className="space-y-2">
      <h2 className="text-left text-2xl font-semibold">
        Select Image To Encode or Decode
      </h2>
      <div className="w-full flex gap-3 justify-between items-center">
        <div className="flex-1 relative max-w-120">
          <input
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            value={search}
            type="text"
            className="w-full text-lg font-medium py-1 pl-9 pr-2 shadow-[inset_0px_0px_10px_-6px_var(--text-primary-light)] rounded-md"
          />
          <button
            className="p-2 text-base font-medium absolute -translate-y-1/2 top-1/2 left-1 sm:left-2"
          >
            <FaSearch />
          </button>
        </div>
        <select
          onChange={(e) => {
            const val = e.target.value;
            const vals = [
              "newest",
              "oldest",
              "alpha",
              "de_alpha",
              "small",
              "large",
            ];
            if (vals.includes(val)) dispatch(setSort(val as ImagesSort));
          }}
          className="px-3 py-2 shadow-[inset_0px_0px_10px_-6px_var(--text-primary-light)] text-lg font-medium bg-(--main-secondary) rounded-md"
          name="sort"
          id="sort_select"
          value={sort}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="alpha">A-Z</option>
          <option value="de_alpha">Z-A</option>
          <option value="small">Smallest First</option>
          <option value="large">Largest First</option>
        </select>
      </div>
    </header>
  );
};

export default HomeHeader;
