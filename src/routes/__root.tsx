import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import Layout from '../components/Layout'

export const Route = createRootRoute({
  component: () => (
    <>
    <Layout>
      {/* <div className="p-2 flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
        Home
        </Link>{' '}
        <Link to="/view" className="[&.active]:font-bold">
        About
        </Link>
        </div>
        <hr /> */}
      <Outlet />
    </Layout>
      <TanStackRouterDevtools />
        </>
  ),
})