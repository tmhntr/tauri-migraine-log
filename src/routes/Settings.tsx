const Settings = () => {
  return <div>Settings</div>;
};

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
});
