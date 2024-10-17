// import React from "react";
// import ReactDOM from "react-dom/client";
// import {
//   createBrowserRouter,
//   RouterProvider,
// } from "react-router-dom";
// import Root from "./routes/root";
// import ErrorPage from "./error-page";

// // import App from "./App";
import "./index.css"
// import Create from "./routes/Create";
// import Home from "./routes/Home";
// import Edit from "./routes/Edit";
// import View from "./routes/View";
// import Settings from "./routes/Settings";

// const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <Root />,
//     errorElement: <ErrorPage />,
//      children: [
//       {
//         index: true,
//         element: <Home />
//       },
//       {
//         path: "create",
//         element: <Create />
//       },
//       {
//         path: "edit/:entryId",
//         element: <Edit />
//       },
//       {
//         path: "view",
//         element: <View />
//       },
//       {
//         path: "settings",
//         element: <Settings />
//       }
//     ]
//   },
// ]);

// ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
//   <React.StrictMode>
//     <RouterProvider router={router} fallbackElement={<Root />} />
//   </React.StrictMode>,
// );
import React, { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Create a new router instance
const router = createRouter({ routeTree, basepath: "/",  })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>,
  )
}