import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EntryData } from "@/schema";
import { useNavigate } from "@tanstack/react-router";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

// interface DataTableProps<TValue> 
// {
//   columns: ColumnDef<EntryType, TValue>[];
//   data: EntryType[];
// }

export function DataTable({
  columns,
  data,
}: {
  columns: ColumnDef<EntryData, any>[];
  data: EntryData[];
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel<EntryData>(),
    getRowId: (originalRow) => originalRow.id.toString(),
  });

  const navigate = useNavigate({});

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                onClick={() =>
                  navigate({
                    to: "/entries/$entryId",
                    params: { entryId: row.id.toString() },
                  })
                }
                className="cursor-pointer"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

//   const EntryTable = ({ data }: { data: EntryType[] }) => {
//     return (
//       <Table>
//     <TableCaption>A list of your recent entries.</TableCaption>
//     <TableHeader>
//       <TableRow>
//         <TableHead className="w-[100px]">Invoice</TableHead>
//         <TableHead>Status</TableHead>
//         <TableHead>Method</TableHead>
//         <TableHead className="text-right">Amount</TableHead>
//       </TableRow>
//     </TableHeader>
//     <TableBody>
//       <TableRow>
//         <TableCell className="font-medium">INV001</TableCell>
//         <TableCell>Paid</TableCell>
//         <TableCell>Credit Card</TableCell>
//         <TableCell className="text-right">$250.00</TableCell>
//       </TableRow>
//     </TableBody>
//   </Table>
//     )
//   }

//   export default EntryTable
