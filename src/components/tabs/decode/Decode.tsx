import { useState } from "react";
import { useDecodeImage } from "../../../hooks/fetchers";
import { useAppSelector } from "../../../store/hooks";
import Button from "../../reusable/Button";
import { Card } from "../encode/Encode";
import ImageBanner from "../encode/ImageBanner";

const Decode = () => {
  const {
    decoded,
    mutation: { isPending, mutateAsync },
  } = useDecodeImage();
  const { selected } = useAppSelector((state) => state.images);
  const [copyText, setCopyText] = useState("Copy Text");

  const copyToCb = async (text: string) => {
    try {
      await window.navigator.clipboard.writeText(text);
      setCopyText("Copied");
      setTimeout(() => {
        setCopyText("Copy Text");
      }, 2000);
    } catch (err) {
      console.log("Error copying text", err);
    }
  };

  return (
    <section className="w-full space-y-3">
      <h2 className="font-semibold text-2xl w-full text-left">
        Encode Selected Image
      </h2>
      <Card>
        <ImageBanner />
      </Card>
      <Card extraClassNames="space-y-2">
        <h3 className="font-semibold text-xl w-full text-left">Decoded Text</h3>
        <p className="w-full min-h-30 rounded-md bg-(--main-tertiary) border-2 border-(--text-secondary) p-2 text-base md:text-lg font-medium max-w-5xl">
          {decoded}
        </p>
        <Button
          attrs={{ onClick: () => copyToCb(decoded) }}
          color="secondary"
          width="w-full"
          rounded="rounded-md"
        >
          {copyText}
        </Button>
      </Card>
      <Button
        attrs={{
          disabled: isPending,
          onClick: () => {
            if (!selected?.file_path?.trim()) return;
            mutateAsync(selected.file_path);
          },
        }}
        width="w-full"
          rounded="rounded-md"
      >
        {isPending ? "Decoding..." : "Decode Image"}
      </Button>
    </section>
  );
};

export default Decode;
