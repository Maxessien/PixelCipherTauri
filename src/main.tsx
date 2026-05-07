import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router";
import App from "./App";
import Decode from "./components/tabs/decode/Decode";
import Encode from "./components/tabs/encode/Encode";
import Home from "./components/tabs/home/Home";
import Settings from "./components/tabs/settings/Settings";
import { store } from "./store";
import History from "./components/tabs/history/History";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "encode", element: <Encode /> },
      { path: "decode", element: <Decode /> },
      { path: "settings", element: <Settings /> },
      { path: "history", element: <History /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>,
);
