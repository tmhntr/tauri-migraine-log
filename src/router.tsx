import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

// Create a new router instance
const router = createRouter({ routeTree, basepath: process.env.NODE_ENV === "pages" ? "/tauri-migraine-log/" : "/" });

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const RouterProviderComponent = () => <RouterProvider router={router} />;
