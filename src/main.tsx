import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Root from "./routes/root";
// import App from "./App";
import "./index.css"
import Create from "./routes/Create";
import Home from "./routes/Home";
import Edit from "./routes/Edit";
import View from "./routes/View";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
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
      }
    ]
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
