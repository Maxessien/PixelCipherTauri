import { ReactNode, useState } from "react";
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
  return (
    <section className="w-full space-y-3">
      <h2 className="font-semibold text-2xl w-full text-left">Encode Selected Image</h2>
      <Card>
        <ImageBanner />
      </Card>
      <Card extraClassNames="space-y-2">
        <h3 className="font-semibold text-xl w-full text-left">Text to Encode</h3>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-md bg-(--main-tertiary) border-2 border-(--text-secondary) p-2 text-base md:text-lg font-medium max-w-5xl"
          value={message}
          name="text"
          id="cipher_text"
        ></textarea>
      </Card>
      <Button
        attrs={{
          disabled: isPending,
          onClick: () => {
            if (!selected?.file_path || !(message.trim().length > 0)) return;
            mutateAsync({ message, path: selected.file_path });
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
