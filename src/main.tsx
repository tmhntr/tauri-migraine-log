import "./index.css";
import { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { Store } from "@tanstack/store";
import { SharedState, User } from "./schema";
import { v4 as uuidv4 } from "uuid";

import { AnyDocumentId, isValidAutomergeUrl, Repo } from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";

const repo = new Repo({
  network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
  storage: new IndexedDBStorageAdapter(),
});

const rootDocUrl = `${document.location.hash.substring(1)}` || localStorage.getItem("docUrl") || "";
console.log({
  location: document.location,
  hash: document.location.hash,
  rootDocUrl,
});
let handle;
if (isValidAutomergeUrl(rootDocUrl)) {
  // add docUrl to localStorage
  
  handle = repo.find(rootDocUrl);
  localStorage.setItem("docUrl", handle.url);
} else {
  handle = repo.create<SharedState>({
    entries: [],
    symptoms: ["Headache", "Nausea", "Sensitivity to light"],
    painSites: ["Forehead", "Temples", "Back of the head"],
    warnings: ["Aura", "Mood changes", "Neck stiffness"],
    managementSteps: [],
    weather: [],
    users: [{ id: uuidv4(), name: "Your name", location: null }],
    locations: [],
  });
  localStorage.setItem("docUrl", handle.url);
}
const docUrl = (document.location.hash = handle.url);
repo.addListener("document", (arg: any) => console.log(arg));
console.log(repo.handles);

// Create a new router instance
const router = createRouter({ routeTree, basepath: process.env.NODE_ENV === "pages" ? "/tauri-migraine-log/" : "/" });

const queryClient = new QueryClient();

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export const store = new Store({
  user: null as User | null,
});

// Create a context for docUrl
export const DocUrlContext = createContext<AnyDocumentId | null>(null);

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <RepoContext.Provider value={repo}>
        <DocUrlContext.Provider value={docUrl}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </DocUrlContext.Provider>
      </RepoContext.Provider>
    </StrictMode>
  );
}
