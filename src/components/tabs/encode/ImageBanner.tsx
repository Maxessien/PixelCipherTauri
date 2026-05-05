import { convertFileSrc } from "@tauri-apps/api/core";
import { FaFolderOpen } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useAppSelector } from "../../../store/hooks";
import { formatFileSize } from "../../../utils/regHepers";
import Button from "../../reusable/Button";

const ImageBanner = () => {
  const { selected } = useAppSelector((state) => state.images);
  const nav = useNavigate()
  return (
    <div>
      <div
        className={`w-full overflow-hidden h-max max-h-130 rounded-md ${!selected?.file_path ? "border-2 border-(--main-primary)" : ""} max-w-lg md:mx-0 mx-auto`}
      >
        {selected?.file_path && (
          <img
            className="w-full h-full object-center object-contain"
            src={convertFileSrc(selected.file_path)}
            alt={selected.file_name + " image"}
          />
        )}
      </div>
      <div className="w-full flex flex-col gap-2 items-start justify-start">
        <p className="font-medium text-base">
          {selected?.file_name || "unknown"}
        </p>
        <p className="font-medium text-lg">{selected?.file_size ? formatFileSize(selected.file_size) : "N/A"}</p>
        <Button attrs={{onClick: ()=>nav("/")}} color="tertiary" rounded="rounded-md">
          <FaFolderOpen /> Change Image
        </Button>
      </div>
    </div>
  );
};

export default ImageBanner;
