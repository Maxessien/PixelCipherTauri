import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { BrowserRouter, Route, Routes, useNavigation } from "react-router";
import "./App.css";
import Decode from "./components/tabs/decode/Decode";
import Encode from "./components/tabs/encode/Encode";
import Home from "./components/tabs/home/Home";
import Settings from "./components/tabs/settings/Settings";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setAppState } from "./store/slices/appSlice";

const AppLoader = () => {
  const { isNavigating } = useAppSelector((state) => state.app);

  return (
    <>
      <AnimatePresence>
        {isNavigating && (
          <motion.div className="h-3 fixed z-999 top-0 left-0 bg-(--main-primary)" 
            initial={{ width: "0%" }}
            animate={{
              width: ["0%", "40%", "75%", "90%"], 
              transition: { duration: 1.5, times: [0, 0.3, 0.7, 1], ease: "easeOut" }
            }}
            exit={{ width: "100%", opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }}
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

  return (
    <>
    <AppLoader />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/encode" element={<Encode />} />
          <Route path="/decode" element={<Decode />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
