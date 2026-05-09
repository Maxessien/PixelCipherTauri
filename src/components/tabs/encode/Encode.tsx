import { ReactNode, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useEncodeImage } from "../../../hooks/fetchers";
import { useAppSelector } from "../../../store/hooks";
import Button from "../../reusable/Button";
import ImageBanner from "./ImageBanner";

export const Card = ({
  children,
  extraClassNames,
}: {
  children: ReactNode;
  extraClassNames?: string;
}) => {
  const fullClsNames =
    "w-full px-3 py-2 rounded-md border-(--text-secondary-light) bg-(--main-tertiary-light) border-2 " +
    extraClassNames;
  return <div className={fullClsNames}>{children}</div>;
};

const Encode = () => {
  const { mutateAsync, isPending } = useEncodeImage();
  const { selected } = useAppSelector((state) => state.images);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [saveInfo, setSaveInfo] = useState({
    name: `Encoded ${selected?.file_name.split(".").slice(0, -1).join(".")}`,
    format: "png",
  });

  return (
    <section className="w-full space-y-3">
      <h2 className="font-semibold hidden md:block text-2xl w-full text-left">
        Encode Selected Image
      </h2>
      <div className="w-full flex items-center gap-2 flex-wrap md:hidden">
        <button onClick={() => navigate("/")} className="text-lg font-semibold">
          <FaArrowLeft />
        </button>
        <h2 className="font-semibold text-2xl w-full flex-1 text-center">
          Encode
        </h2>
      </div>
      <Card>
        <ImageBanner />
      </Card>
      <Card extraClassNames="space-y-2">
        <h3 className="font-semibold text-xl w-full text-left">
          Text to Encode
        </h3>
        <textarea
          onChange={(e) => {
            if (
              !selected?.file_size ||
              message.length * 8 >= selected.file_size - 88
            )
              return;
            setMessage(e.target.value);
          }}
          className="w-full min-h-30 rounded-md bg-(--main-tertiary) border-2 border-(--text-secondary) p-2 text-base md:text-lg font-medium max-w-5xl"
          value={message}
          name="text"
          id="cipher_text"
        ></textarea>
        <p className="text-base font-medium">
          You have approx{" "}
          {selected?.file_size
            ? selected.file_size - 88 - message.length * 8
            : "0"}{" "}
          characters left
        </p>
      </Card>
      <Card extraClassNames="w-full flex justify-between items-start space-y-3 sm:items-center gap-2 flex-col sm:flex-row">
        <div className="flex-1 space-y-1">
          <p className="text-base font-medium">Save as</p>
          <input
            onChange={(e) =>
              setSaveInfo((state) => ({ ...state, name: e.target.value }))
            }
            value={saveInfo.name}
            type="text"
            className="w-full text-lg font-medium py-1 px-2 shadow-[inset_0px_0px_10px_-6px_var(--text-primary-light)] rounded-md"
          />
        </div>
      </Card>
      <Button
        attrs={{
          disabled:
            isPending ||
            message?.trim()?.length <= 0 ||
            saveInfo.name?.trim()?.length <= 0 ||
            !["jpg", "webp", "png"].includes(saveInfo.format),
          onClick: () => {
            if (!selected?.file_path || !(message.trim().length > 0)) return;
            mutateAsync({
              message,
              path: selected.file_path,
              save_name: `${saveInfo.name}.${saveInfo.format}`,
              imgFormat: saveInfo.format,
            });
          },
        }}
        width="w-full"
        rounded="rounded-md"
      >
        {isPending ? "Encoding..." : "Encode Image"}
      </Button>
    </section>
  );
};

export default Encode;
