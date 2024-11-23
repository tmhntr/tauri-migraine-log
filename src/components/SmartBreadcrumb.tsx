import { useLocation } from "@tanstack/react-router";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from './ui/breadcrumb';

function useTSRBreadCrumbs() {
    const current = useLocation();
  
    const route_history = current.pathname
      .split("/")
      .filter((x) => x && x.length > 0);
  
    const breadcrumb_routes = route_history.reduce(
      (acc: { name: string; path: string }[], route) => {
        const prev_path = acc[acc.length - 1]?.path ?? "";
        acc.push({ name: route, path: `${prev_path}/${route}` });
        return acc;
      },
      [],
    );
    return { breadcrumb_routes };
}

export function SmartBreadcrumb() {
    const { breadcrumb_routes } = useTSRBreadCrumbs();
    if (breadcrumb_routes.length < 2) return null;
    return (
        <Breadcrumb className="hidden md:flex">
            <BreadcrumbList>
                {breadcrumb_routes.map((crumb, index) => {
                    if (index === breadcrumb_routes.length - 1) {
                        return (
                            <BreadcrumbItem key={crumb.path}>
                                <BreadcrumbPage>{crumb.name}</BreadcrumbPage>
                            </BreadcrumbItem>
                        );
                    }
                    return (
                        <BreadcrumbItem key={crumb.path}>
                            <BreadcrumbLink asChild>
                                <a href={crumb.path}>{crumb.name}</a>
                            </BreadcrumbLink>
                            <BreadcrumbSeparator />
                        </BreadcrumbItem>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}