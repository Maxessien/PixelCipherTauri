import { convertFileSrc } from "@tauri-apps/api/core";
import { useGetImages } from "../../../hooks/fetchers";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import HomeHeader from "./HomeHeader";
import { setSelected } from "../../../store/slices/imagesSlice";

const Home = () => {
  const { isFetching } = useGetImages();
  const { files, selected } = useAppSelector((state) => state.images);

  const dispatch = useAppDispatch()

  const isSelected = (name: string, path: string) =>
    selected?.file_name === name && selected.file_path === path;

  return (
    <section className="space-y-3">
      <HomeHeader />
      {isFetching ? (
        <p className="w-full text-3xl font-medium text-center">Loading...</p>
      ) : (
        files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-w-7xl mx-auto">
            {files.map((img) => {
              const { file_name, file_size, file_path } = img
              return (
                <div
                  onClick={()=>dispatch(setSelected(img))}
                  className={`w-full rounded-md flex flex-col justify-between ${isSelected(file_name, file_path) ? "border-(--main-primary) border-2" : "border-(--text-secondary-light) border"}`}
                >
                  <img
                    src={convertFileSrc(file_path)}
                    alt={file_name + " image"}
                    className="w-full"
                  />
                  <div className="w-full px-3 py-2 font-medium">
                    <p className="text-base">{file_name}</p>
                    <p className="text-lg text-(--text-primary-light)">
                      {(file_size / (1024 * 1024)).toFixed(1)} MB
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
    </section>
  );
};

export default Home;
