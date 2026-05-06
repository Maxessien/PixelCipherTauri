import { invoke } from "@tauri-apps/api/core";
import { Image } from "../types";

const handleAsync = async <T>(
  callback: () => Promise<T>,
  customErrorMessage: string = "Error performing async: ",
) => {
  try {
    const res = await callback();
    return res;
  } catch (err) {
    console.log(customErrorMessage, err);
    throw err;
  }
};

const getImageList = () =>
  handleAsync<Image[]>(async () => await invoke("list_images"));

const encodeImage = (path: string, message: string, saveName: string) =>
  handleAsync(
    async () => await invoke<string>("encode_image", { path, message, saveName }),
  );

const decodeImage = (path: string) =>
  handleAsync(
    async () => await invoke<string>("decode_image", { path }),
  );

export { decodeImage, encodeImage, getImageList, handleAsync };

