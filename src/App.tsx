import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { Outlet, useNavigation } from "react-router";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setAppState, setSettings } from "./store/slices/appSlice";
import { convertFileSrc } from "@tauri-apps/api/core";
import { appDataDir } from "@tauri-apps/api/path";
import { AppSettings } from "./types";

const AppLoader = () => {
  const { isNavigating } = useAppSelector((state) => state.app);

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            className="h-3 fixed z-999 top-0 left-0 bg-(--main-primary)"
            initial={{ width: "0%" }}
            animate={{
              width: ["0%", "40%", "75%", "90%"],
              transition: {
                duration: 1.5,
                times: [0, 0.3, 0.7, 1],
                ease: "easeOut",
              },
            }}
            exit={{
              width: "100%",
              opacity: 0,
              transition: { duration: 0.3, ease: "easeIn" },
            }}
          ></motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

function App() {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();

  useEffect(() => {
    switch (navigation.state) {
      case "loading":
        dispatch(setAppState({ field: "isNavigating", value: true }));
        break;

      case "idle":
        dispatch(setAppState({ field: "isNavigating", value: false }));
        break;

      default:
        dispatch(setAppState({ field: "isNavigating", value: false }));
        break;
    }
  }, [navigation.state]);

  useEffect(() => {
    (async () => {
      const dir = await appDataDir();
      const url = convertFileSrc(dir);
      const res = fetch(url);
      const settings: AppSettings = await (await res).json();
      dispatch(setSettings(settings));
    })();
  }, []);

  return (
    <>
      <AppLoader />
      <AppLayout>
        <Outlet />
      </AppLayout>
    </>
  );
}

export default App;
