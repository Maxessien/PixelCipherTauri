import { convertFileSrc } from "@tauri-apps/api/core";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useGetImages } from "../../../hooks/fetchers";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import { setSelected } from "../../../store/slices/imagesSlice";
import { formatFileSize } from "../../../utils/regHepers";
import Button from "../../reusable/Button";
import HomeHeader from "./HomeHeader";

const Home = () => {
  const { isFetching, refetch, setCurrPage, scrollRef } = useGetImages();
  const { files, selected, pages } = useAppSelector((state) => state.images);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isSelected = (name: string, path: string) =>
    selected?.file_name === name && selected.file_path === path;

  return (
    <section className="space-y-3 h-full flex flex-col w-full">
      <HomeHeader refreshFn={refetch} />
      {isFetching ? (
        <p className="w-full text-3xl font-medium text-center">Loading...</p>
      ) : (
        files.length > 0 && (
          <div
            ref={scrollRef}
            className="grid flex-1 overflow-y-auto overflow-x-hidden w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-3 max-w-7xl mx-auto"
          >
            {files.map((img) => {
              const { file_name, file_size, file_path } = img;
              return (
                <div
                  onClick={() =>
                    isSelected(file_name, file_path)
                      ? dispatch(setSelected(null))
                      : dispatch(setSelected(img))
                  }
                  className={`w-full rounded-md flex cursor-pointer flex-col justify-between ${isSelected(file_name, file_path) ? "border-(--main-primary) border-2" : "border-(--text-secondary-light) border"}`}
                >
                  <div className="w-full aspect-square overflow-hidden">
                    <img
                    src={convertFileSrc(file_path)}
                    alt={file_name + " image"}
                    className="w-full h-full object-cover object-center"
                  />
                  </div>
                  <div className="w-full px-3 py-2 font-medium">
                    <p className="text-base wrap-break-word">{file_name}</p>
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
      <div className="flex justify-between items-center gap-2">
        <Button
          attrs={{
            onClick: () => {
              if (pages.current <= 1) return;
              setCurrPage(pages.current - 1);
            },
            disabled: pages.current <= 1,
          }}
          usePredefinedSize={false}
          className="text-lg p-3"
        >
          <FaArrowLeft />
        </Button>
        <div className="flex-1 flex justify-start items-center gap-2 overflow-x-auto">
          {Array(pages.total)
            .fill("n")
            .map((_, idx) => {
              return (
                <Button
                  attrs={{ onClick: () => setCurrPage(idx + 1) }}
                  usePredefinedSize={false}
                  className="text-base py-1 px-3"
                  color={idx + 1 === pages.current ? "primary" : "tertiary"}
                >
                  {idx + 1}
                </Button>
              );
            })}
        </div>
        <Button
          attrs={{
            onClick: () => {
              if (pages.current >= pages.total) return;
              setCurrPage(pages.current + 1);
            },
            disabled: pages.current >= pages.total,
          }}
          usePredefinedSize={false}
          className="text-lg p-3"
        >
          <FaArrowRight />
        </Button>
      </div>
      <div className="flex w-full justify-between pb-3 items-center gap-2">
        <Button
          attrs={{
            disabled: selected === null,
            onClick: () => navigate("/encode"),
          }}
          className="flex-1"
          rounded="rounded-md"
        >
          Encode Selected
        </Button>
        <Button
          attrs={{
            disabled: selected === null,
            onClick: () => navigate("/decode"),
          }}
          className="flex-1"
          rounded="rounded-md"
        >
          Decode Selected
        </Button>
      </div>
    </section>
  );
};

export default Home;
