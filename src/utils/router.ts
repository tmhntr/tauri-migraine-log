import { createRouter } from "@tanstack/react-router";
import { routeTree } from "../routeTree.gen.js";

const router = createRouter({ routeTree, basepath: process.env.NODE_ENV === "pages" ? "/tauri-migraine-log/" : "/" });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
