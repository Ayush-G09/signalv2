import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./Dashboard";
import Stocks from "./Stocks";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/stocks/:name",
    element: <Stocks/>
  }
]);