import { invoke } from "@tauri-apps/api/core";
import { AppSettings, Image } from "../types";
import { defaultSettings } from "./regHepers";

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

const encodeImage = (path: string, message: string, saveName: string, imgFormat: string) =>
  handleAsync(
    async () =>
      await invoke<string>("encode_image", { path, message, saveName, imgFormat }),
  );

const decodeImage = (path: string) =>
  handleAsync(async () => await invoke<string>("decode_image", { path }));

const saveSettings = async(settings: AppSettings) => {
  try {
    await invoke("save_settings", { settings: JSON.stringify(settings) })
  } catch (err) {
    console.log(err)
  }
}

const getSettings = () =>
  handleAsync(
    async () => await invoke<string>("get_settings", { defaultSettings: JSON.stringify(defaultSettings) }),
  );

export {
  decodeImage,
  encodeImage,
  getImageList, getSettings, handleAsync,
  saveSettings
};

