import { createBrowserRouter } from "react-router";
import { PortfolioV2 } from "./components/PortfolioV2";

export const router = createBrowserRouter(
  [
    {
      path: "/",
      Component: PortfolioV2,
    },
  ],
  {
    // The site is served from /portfolio/ on GitHub Pages and from the root in
    // local development. Without this, the "/" route would not match the
    // deployed URL and the page would render nothing.
    // BASE_URL always carries a trailing slash; react-router wants it without.
    basename: import.meta.env.BASE_URL.replace(/\/$/, "") || "/",
  },
);
