import "./index.css";
import { StrictMode, createContext } from "react";
import ReactDOM from "react-dom/client";
import { Store } from "@tanstack/store";
import { SharedState, User } from "./schema";
import { App, AppProviders } from "./providers";
import { RouterProviderComponent as Router } from "./router";

// Create a new router instance


export const store = new Store({
  user: null as User | null,
});

// Create a context for docUrl

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
          <App>
            {/* Your app components go here */}
            {/* <Router /> */}
          </App>
    </StrictMode>
  );
}
