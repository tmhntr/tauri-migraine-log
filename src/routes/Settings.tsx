import SettingsForm from "@/components/SettingsForm";

const Settings = () => {
  return (
    <div>
      <SettingsForm />
    </div>
  );
};

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/settings")({
  component: Settings,
});
