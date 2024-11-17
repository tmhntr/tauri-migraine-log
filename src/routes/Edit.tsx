const Edit = () => {
  return <div>Edit</div>;
};

import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/edit")({
  component: Edit,
});
