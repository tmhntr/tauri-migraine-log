"use client"

import { ColumnDef, createColumnHelper } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { labels, priorities, statuses } from "../data/data"
import { Entry } from "../data/schema"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

const columnHelper = createColumnHelper<Entry>()

export const columns = [
  columnHelper.accessor("id", {
    header: "Id",
  }),
  columnHelper.accessor("episode_date", {
    header: "Date",
  }),
  columnHelper.accessor("estimated_onset_time", {
    header: "Onset Time",
    enableHiding: true,
  }),
  columnHelper.accessor("estimated_onset_period", {
    header: "Onset Period",
  }), 
  columnHelper.accessor("estimated_ended_time", {
    header: "Ended Time",
  }),
  columnHelper.accessor("factors_brought_on", {
    header: "Brought On",
  }),
  columnHelper.accessor("factors_relieve", {
    header: "Relief",
  }),
  columnHelper.accessor("headache_severity", {
    header: "Severity",
  }),
  columnHelper.accessor("recent_duration_of_sleep", {
    header: "Duration of Sleep",
  }),
  columnHelper.accessor("total_hours_of_migraine", {
    header: "Total Hours of Migraine",
  }),
  columnHelper.accessor("symptoms_throbbing", {
    header: "Throbbing",
  }),
  columnHelper.accessor("symptoms_burning", {
    header: "Burning",
  }),
  columnHelper.accessor("symptoms_dull_ache", {
    header: "Dull Ache",
  }),
  columnHelper.accessor("symptoms_knife_like", {
    header: "Knife-like",
  }),
  columnHelper.accessor("symptoms_nausea", {
    header: "Nausea",
  }),
  columnHelper.accessor("symptoms_light_sensitivity", {
    header: "Light Sensitivity",
  }),
  columnHelper.accessor("symptoms_pressure", {
    header: "Pressure",
  }),
  columnHelper.accessor("symptoms_aura", {
    header: "Aura",
  }),
  columnHelper.accessor("symptoms_tight_band", {
    header: "Tight Band",
  }),
  columnHelper.accessor("symptoms_neck_ache", {
    header: "Neck Ache",
  }),
  columnHelper.accessor("warning_vision", {
    header: "Vision",
  }),
  columnHelper.accessor("warning_numbness", {
    header: "Numbness",
  }),
  columnHelper.accessor("warning_aching_neck", {
    header: "Aching Neck",
  }),
  columnHelper.accessor("warning_other", {
    header: "Other",
  }),
  columnHelper.accessor("factors_brought_on", {
    header: "Brought On",
  }),
  columnHelper.accessor("factors_relieve", {
    header: "Relief",
  }),
  columnHelper.accessor(row => <DataTableRowActions entry={row} />,{
  id: "actions",
    header: "Actions",
    // cell: ({ row }) => <DataTableRowActions entry={row.original} />,
  }),
]



// export const columns: ColumnDef<Entry>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //       className="translate-y-[2px]"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Id" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: "date",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Date" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("date")}</div>,
  //   enableSorting: false,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: "intensity",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Severity" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue('headache_severity')}</div>,
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: "duration",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Duration" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("duration")}</div>,
  //   enableSorting: true,
  //   enableHiding: true,
  // },
  // {
  //   accessorKey: "total_hours_of_migraine",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Total Hours of Migraine" />
  //   ),
  //   cell: ({ row }) => <div className="w-[80px]">{row.getValue("total_hours_of_migraine")}</div>,
  //   enableSorting: true,
  //   enableHiding: true,
  // },

  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },

  // {
  //   accessorKey: "title",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Title" />
  //   ),
  //   cell: ({ row }) => {
  //     const label = labels.find((label) => label.value === row.original.id.toString())

  //     return (
  //       <div className="flex space-x-2">
  //         {label && <Badge variant="outline">{label.label}</Badge>}
  //         <span className="max-w-[500px] truncate font-medium">
  //           {row.getValue("id")}
  //         </span>
  //       </div>
  //     )
  //   },
  // },
  // {
  //   accessorKey: "status",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Status" />
  //   ),
  //   cell: ({ row }) => {
  //     const status = statuses.find(
  //       (status) => status.value === row.getValue("status")
  //     )

  //     if (!status) {
  //       return null
  //     }

  //     return (
  //       <div className="flex w-[100px] items-center">
  //         {status.icon && (
  //           <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{status.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     )

  //     if (!priority) {
  //       return null
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     )
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id))
  //   },
  // },
// ]
