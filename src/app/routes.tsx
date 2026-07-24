import { createBrowserRouter } from "react-router";
import { Home } from "./components/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Home,
  },
]);
