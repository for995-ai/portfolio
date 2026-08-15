import { createBrowserRouter } from "react-router";
import { PortfolioV2 } from "./components/PortfolioV2";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: PortfolioV2,
  },
]);
