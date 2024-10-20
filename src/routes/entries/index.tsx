import { getEntries } from "@/db";
import { DataTable } from "@/components/entry-table";

function DataTablePage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["entries"],
    queryFn: getEntries,
  });

  if (error) return <Navigate />;

  return (
    <>
      <div className=""></div>
      <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your entries!
            </p>
          </div>
        </div>{" "}
        <div className="flex flex-col">
          {isLoading ? (
            <Loader />
          ) : (
            <DataTable data={data ?? []} columns={columns} />
          )}
        </div>
      </div>
    </>
  );
}

import { createFileRoute, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { columns } from "@/components/entry-table/columns";

export const Route = createFileRoute("/entries/")({
  component: DataTablePage,
});
