// import { getEntries } from "@/db";
import { DataTable } from "@/components/entry-table";

function DataTablePage() {
  // const { data, error, isLoading } = useListEntries();
  const [doc, _] = useDocument();
  const data = doc?.entries;
  console.log(data);
  // if (error) return <Navigate />;

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
          {data && <DataTable data={data} columns={defaultColumns} />}
        </div>
      </div>
    </>
  );
}

import { createFileRoute } from "@tanstack/react-router";
import { defaultColumns } from "@/components/entry-table/columns";
import { useDocument } from "@/hooks/document";

export const Route = createFileRoute("/entries/")({
  component: DataTablePage,
});
