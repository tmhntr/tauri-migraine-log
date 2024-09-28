import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
import ErrorPage from "./error-page";

// import App from "./App";
import "./index.css"
import Create from "./routes/Create";
import Home from "./routes/Home";
import Edit from "./routes/Edit";
import View from "./routes/View";
import Settings from "./routes/Settings";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
     children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: "create",
        element: <Create />
      },
      {
        path: "edit/:entryId",
        element: <Edit />
      },
      {
        path: "view",
        element: <View />
      },
      {
        path: "settings",
        element: <Settings />
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} fallbackElement={<Root />} />
  </React.StrictMode>,
);
