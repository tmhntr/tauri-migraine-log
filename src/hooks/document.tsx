import { useDocument as useDocumentInternal } from "@automerge/automerge-repo-react-hooks";
// import { SharedState } from "@/schema";
// import { isValidAutomergeUrl } from "@automerge/automerge-repo";

// export const useDocument = () => {
//   const docUrl = localStorage.getItem("docUrl");
//   if (!isValidAutomergeUrl(docUrl)) {
//     throw new Error("Invalid docUrl");
//   }
//     console.log(docUrl);
//     return useDocumentInternal<SharedState>(docUrl);

// };

import { SharedState } from "@/schema";
import {
  AnyDocumentId,
  // DocHandle,
  isValidAutomergeUrl,
  Repo,
} from "@automerge/automerge-repo";
import { BrowserWebSocketClientAdapter } from "@automerge/automerge-repo-network-websocket";
import { RepoContext } from "@automerge/automerge-repo-react-hooks";
import { IndexedDBStorageAdapter } from "@automerge/automerge-repo-storage-indexeddb";
import { createContext, useContext, useEffect, useState } from "react";

type DocumentProviderProps = {
  children: React.ReactNode;
  // defaultDocument?: Document;
  storageKey?: string;
};

type DocumentProviderState = {
  docUrl: AnyDocumentId | null;
  setDocUrl: (docUrl: string) => void;
  // repo: Repo | null;
  // setRepo: (repo: Repo) => void;
};

const initialState: DocumentProviderState = {
  docUrl: null,
  setDocUrl: () => null,
  // repo: null,
  // setRepo: () => null,
};

const DocumentProviderContext =
  createContext<DocumentProviderState>(initialState);

export function DocumentProvider({
  children,
  storageKey = "migrainelog-docUrl",
  ...props
}: DocumentProviderProps) {
  const [docUrl, setDocUrl] = useState<AnyDocumentId | null>(
    () => (localStorage.getItem(storageKey) as AnyDocumentId) || null
  );

  // const [repo, setRepo] = useState<Repo | null>(null);
  const repo = new Repo({
    network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
    storage: new IndexedDBStorageAdapter(),
  });

  // useEffect(() => {
  //   const newRepo = new Repo({
  //     network: [new BrowserWebSocketClientAdapter("wss://sync.automerge.org")],
  //     storage: new IndexedDBStorageAdapter(),
  //   });
  //   setRepo(newRepo);
  // }, []);

  useEffect(() => {
    if (isValidAutomergeUrl(document.location.hash.substring(1))) {
      const hashDocUrl = document.location.hash.substring(1) as AnyDocumentId;
      localStorage.setItem(storageKey, hashDocUrl.toString());
      setDocUrl(hashDocUrl);
    }
    if (!repo) return;

    if (docUrl) {
      repo.find<SharedState>(docUrl);
    } else {
      const handle = repo.create<SharedState>({
        entries: [],
        symptoms: ["Headache", "Nausea", "Sensitivity to light"],
        painSites: ["Forehead", "Temples", "Back of the head"],
        warnings: ["Aura", "Mood changes", "Neck stiffness"],
        managementSteps: [],
        weather: [],
        users: [],
        locations: [],
      });
      setDocUrl(handle.url);
      localStorage.setItem(storageKey, handle.url);
    }
    repo.addListener("document", (arg: any) => console.log(arg));
  }, [docUrl, repo]);

  const value = {
    docUrl,
    setDocUrl: (docUrl: string) => {
      if (!isValidAutomergeUrl(docUrl)) {
        throw new Error("Invalid docUrl");
      }
      localStorage.setItem(storageKey, docUrl);
      setDocUrl(docUrl);
    },
    // repo,
    // setRepo: (repo: Repo) => {
    //   setRepo(repo);
    // },
  };

  return (
    <DocumentProviderContext.Provider value={value} {...props}>
      <RepoContext.Provider value={repo}>{children}</RepoContext.Provider>
    </DocumentProviderContext.Provider>
  );
}

export const useDocUrl = () => {
  const context = useContext(DocumentProviderContext);

  if (context === undefined)
    throw new Error("useDocument must be used within a DocumentProvider");

  return [context.docUrl, context.setDocUrl] as const;
};

// export const useRepo = () => {
//   const context = useContext(DocumentProviderContext);

//   if (context === undefined)
//     throw new Error("useDocument must be used within a DocumentProvider");

//   return [context.repo, context.setRepo] as const;
// };

export const useDocument = () => {
  const [docUrl, _] = useDocUrl();

  if (!docUrl) {
    throw new Error("Error no docUrl");
  }

  return useDocumentInternal<SharedState>(docUrl);
};
