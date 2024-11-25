// import { getEntries } from "@/db";
import { DataTable } from "@/components/entry-table";

function DataTablePage() {
  // const { data, error, isLoading } = useListEntries();
  const [doc, changeDoc] = useDocument();
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

import { createFileRoute, Navigate } from "@tanstack/react-router";
import { Loader } from "lucide-react";
import { defaultColumns } from "@/components/entry-table/columns";
import { useDocument } from "@/hooks/document";
import { SharedState } from "@/schema";
import { AnyDocumentId } from "@automerge/automerge-repo";
// import { useListEntries } from "@/hooks/queries";
// import { EntryType } from "@/schema";

export const Route = createFileRoute("/entries/")({
  component: DataTablePage,
});
