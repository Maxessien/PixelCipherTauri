import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { Outlet, useNavigation } from "react-router";
import { ToastContainer } from "react-toastify";
import "./App.css";
import AppLayout from "./components/layouts/AppLayout";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setAppState, setSettings } from "./store/slices/appSlice";
import { getSettings, saveSettings } from "./utils/invokers";

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
  const { settings } = useAppSelector((state) => state.app);

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

  const settingsInit = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const sett = await getSettings();
        dispatch(setSettings(JSON.parse(sett)));
        settingsInit.current = true;
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    if (!settingsInit.current) return;
    saveSettings(settings);
  }, [settings]);

  useEffect(()=>{
    switch (settings.theme) {
      case "dark":
        document.body.setAttribute("data-theme", "dark")
        break;
      case "light":
        document.body.setAttribute("data-theme", "light")
        break;
      case "system":
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.body.setAttribute("data-theme", isDarkMode ? "dark" : "light")
        break;
      default:
        break;
    }
  }, [settings.theme])

  return (
    <>
      <AppLoader />
      <AppLayout>
        <Outlet />
      </AppLayout>
      <ToastContainer
        newestOnTop
        pauseOnHover
        position="top-center"
        theme="dark"
      />
    </>
  );
}

export default App;
