import "./index.css";
import { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { routeTree } from "./routeTree.gen";
import { Store } from "@tanstack/store";
import { SharedState, User } from "./schema";

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
  handle = repo.find(rootDocUrl);
} else {
  handle = repo.create<SharedState>({
    entries: [],
    symptoms: ["Headache", "Nausea", "Sensitivity to light"],
    painSites: ["Forehead", "Temples", "Back of the head"],
    warnings: ["Aura", "Mood changes", "Neck stiffness"],
    managementSteps: [],
    weather: [],
    users: [{ id: 1, name: "Your name", location: null }],
    locations: [],
  });
}
const docUrl = (document.location.hash = handle.url);
localStorage.setItem("docUrl", docUrl);
repo.addListener("document", (arg: any) => console.log(arg));
console.log(repo.handles);

// Create a new router instance
const router = createRouter({ routeTree, basepath: "/" });

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
