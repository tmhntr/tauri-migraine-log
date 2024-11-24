import { createRootRoute, Outlet } from "@tanstack/react-router";
import Layout from "@/components/Layout";

import { store } from "@/main";
import { useStore } from "@tanstack/react-store";
import { Login } from "./login";

export const Route = createRootRoute({
  component: () => {
    const user = useStore(store, (s) => s.user);

    return (
      <>
        <Layout>{!user ? <Login /> : <Outlet />}</Layout>
      </>
    );
  },
});
