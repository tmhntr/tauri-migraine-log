import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { EntryData } from "../../schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "../ui/badge";

// // Helper function to format symptoms array into a string
// const getEntrySymptoms = (symptoms: EntryData['symptoms']) => {
//   console.log(symptoms)
//   return symptoms?.map(s => s.name).join(", ") || '';
// };

export const colorCodes = (severity: EntryData["headache_severity"]) => {
  if (!severity) return "hidden";

  switch (severity) {
    case "Extreme":
      return "bg-red-600";
    case "Severe":
      return "bg-orange-500";
    case "Moderate":
      return "bg-yellow-600";
    case "Mild":
      return "bg-green-600";
    default:
      return "hidden";
  }
};

const columnHelper = createColumnHelper<EntryData>();

export const defaultColumns: ColumnDef<EntryData, any>[] = [
  columnHelper.accessor("start_time", {
    id: "start_date",
    header: "Start Date",
    cell: (props) => new Date(props.getValue()).toDateString() ?? "N/A",
  }),
  columnHelper.accessor("start_time", {
    header: "Start Time",
    cell: (props) =>
      new Date(props.getValue()).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) ?? "N/A",
  }),
  columnHelper.accessor("end_time", {
    header: "End Time",
    cell: (props) =>
      new Date(props.getValue()).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      }) ?? "N/A",
  }),
  columnHelper.display({
    id: "duration",
    header: "Duration",
    cell: (props) => {
      if (!props.row.original.start_time || !props.row.original.end_time) {
        return "N/A";
      }
      const startTime = new Date(props.row.original.start_time);
      const endTime = new Date(props.row.original.end_time);
      const duration = endTime.getTime() - startTime.getTime();
      const hours = Math.floor(duration / 3600000);
      const minutes = Math.floor((duration % 3600000) / 60000);
      return `${hours}h ${minutes}m`;
    },
  }),
  columnHelper.accessor("headache_severity", {
    header: "Severity",
    id: "headache_severity",
    cell: (props) => (
      <Badge className={colorCodes(props.getValue())}>
        {props.getValue() ?? "N/A"}
      </Badge>
    ),
  }),
  columnHelper.accessor("symptoms", {
    id: "symptoms",
    header: () => "Symptoms",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1 text-muted-foreground">
          {row.original.symptoms.map((symptom, i) => (
            <Badge key={i}>{symptom}</Badge>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("pain_sites", {
    header: "Pain Sites",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1 text-muted-foreground">
          {row.original.pain_sites.map((pain_site, i) => (
            <Badge key={i}>{pain_site}</Badge>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("warnings", {
    header: "Warnings",
    cell: ({ row }) => {
      return (
        <div className="flex flex-wrap gap-1 text-muted-foreground">
          {row.original.warnings.map((warning, i) => (
            <Badge key={i}>{warning}</Badge>
          ))}
        </div>
      );
    },
  }),
  columnHelper.accessor("hydration_oz", {
    header: "Hydration (oz)",
    cell: (props) => props.getValue() ?? "N/A",
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => <DataTableRowActions entry={props.row.original} />,
  }),
];
