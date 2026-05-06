import { convertFileSrc } from "@tauri-apps/api/core";
import { useNavigate } from "react-router";
import { useGetImages } from "../../../hooks/fetchers";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSelected } from "../../../store/slices/imagesSlice";
import { formatFileSize } from "../../../utils/regHepers";
import Button from "../../reusable/Button";
import HomeHeader from "./HomeHeader";

const Home = () => {
  const { isFetching } = useGetImages();
  const { files, selected } = useAppSelector((state) => state.images);

  const dispatch = useAppDispatch();
  const navigate = useNavigate()

  const isSelected = (name: string, path: string) =>
    selected?.file_name === name && selected.file_path === path;

  return (
    <section className="space-y-3 h-full flex flex-col w-full">
      <HomeHeader />
      {isFetching ? (
        <p className="w-full text-3xl font-medium text-center">Loading...</p>
      ) : (
        files.length > 0 && (
          <div className="grid flex-1 overflow-y-auto overflow-x-hidden w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-w-7xl mx-auto">
            {files.map((img) => {
              const { file_name, file_size, file_path } = img;
              return (
                <div
                  onClick={() => isSelected(file_name, file_path) ? dispatch(setSelected(null)) : dispatch(setSelected(img))}
                  className={`w-full rounded-md flex cursor-pointer flex-col justify-between ${isSelected(file_name, file_path) ? "border-(--main-primary) border-2" : "border-(--text-secondary-light) border"}`}
                >
                  <img
                    src={convertFileSrc(file_path)}
                    alt={file_name + " image"}
                    className="w-full"
                  />
                  <div className="w-full px-3 py-2 font-medium">
                    <p className="text-base break-words">{file_name}</p>
                    <p className="text-lg text-(--text-primary-light)">
                      {formatFileSize(file_size)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}
      <div className="flex w-full justify-between pb-3 items-center gap-2">
        <Button attrs={{disabled: selected === null, onClick: ()=> navigate("/encode")}} className="flex-1" rounded="rounded-md">
          Encode Selected
        </Button>
        <Button attrs={{disabled: selected === null, onClick: ()=> navigate("/decode")}} className="flex-1" rounded="rounded-md">
          Decode Selected
        </Button>
      </div>
    </section>
  );
};

export default Home;
