import { createRootRoute, Link, Outlet, useNavigate } from "@tanstack/react-router";
import Layout from "@/components/Layout";

import { store } from "@/main";
import { useStore } from "@tanstack/react-store";
import { lazy, Suspense, useLayoutEffect } from "react";
import { trpc } from "../utils/trpc";

import { Login } from "./_login";
// import { useUser } from "@/hooks/auth";
const getRedirectParam = () => {
  const currentUrl = window.location.href;
  const urlParams = new URLSearchParams(new URL(currentUrl).search);
  const redirectParam = urlParams.get("redirect") || undefined;
  if (redirectParam !== "/login" && redirectParam !== "/register") {
    return redirectParam;
  }
};
const TanStackRouterDevtools =
  process.env.NODE_ENV === "production"
    ? () => null // Render nothing in production
    : lazy(() =>
        // Lazy load in development
        import("@tanstack/router-devtools").then((res) => ({
          default: res.TanStackRouterDevtools,
          // For Embedded Mode
          // default: res.TanStackRouterDevtoolsPanel
        })),
      );

export const Route = createRootRoute({
  component: () => {
    const navigate = useNavigate();

    
    useLayoutEffect(() => {
      if (!localStorage.getItem("sessionKey")) {
        navigate({
          to: "/login",
          search:
            window.location.pathname !== "/" &&
            window.location.pathname !== "/login" &&
            window.location.pathname !== "/register"
              ? { redirect: window.location.pathname }
              : undefined,
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const meQuery = trpc.me.useQuery(undefined, {
      // avoid lot's of retries in case of unauthorized blocking a page load
      retry: (failureCount, error) => {
        if (error.data?.code === "UNAUTHORIZED") {
          return false;
        }
        if (failureCount > 3) return false;
        return true;
      },
    });
  //   const logoutMutation = trpc.logout.useMutation();
  // const queryClient = useQueryClient();

  const isNotAuthorized = meQuery.error?.data?.code === "UNAUTHORIZED";

    return (
      <>
        <Layout>{(!meQuery.data && !meQuery.isLoading) || isNotAuthorized ? (
            <>
              <Link to="/login" search={{ redirect: getRedirectParam() }}>
                Login
              </Link>
              <Link to="/register" search={{ redirect: getRedirectParam() }}>
                Sign up
              </Link>
            </>
          ) : <Outlet />}</Layout>
        <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
      </>
    );
  },
});
