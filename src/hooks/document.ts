import { useDocument as useDocumentInternal } from "@automerge/automerge-repo-react-hooks";
import { SharedState } from "@/schema";
import { isValidAutomergeUrl } from "@automerge/automerge-repo";

export const useDocument = () => {
  const docUrl = localStorage.getItem("docUrl");
  if (!isValidAutomergeUrl(docUrl)) {
    throw new Error("Invalid docUrl");
  }
    console.log(docUrl);
    return useDocumentInternal<SharedState>(docUrl);
  

};
