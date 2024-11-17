import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { EntryData } from "../../schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "../ui/badge";

// Helper function to format symptoms array into a string
const getEntrySymptoms = (symptoms: EntryData['symptoms']) => {
  console.log(symptoms)
  return symptoms?.map(s => s.name).join(", ") || '';
};

export const colorCodes = (severity: EntryData["headache_severity"]) => {
  if (!severity) return "";
  
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
      return "";
  }
};

const columnHelper = createColumnHelper<EntryData>();

export const defaultColumns: ColumnDef<EntryData, any>[] = [
  columnHelper.accessor("start_time", {
    header: "Start Time",
    cell: (props) => new Date(props.getValue()).toDateString() ?? "N/A"
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
  // columnHelper.accessor('symptoms', {
  //   id: 'symptoms',
  //   header: "Symptoms",
  //   cell: (props) => props.row.original.symptoms?.map(site => site.name).join(", ") ?? '...'
  // }),
  columnHelper.display({
    id: "pain_sites",
    header: "Pain Sites",
    cell: (props) => props.row.original.pain_sites?.map(site => site.name).join(", ") ?? '...'
  }),
  columnHelper.accessor("hydration_oz", {
    header: "Hydration (oz)",
    cell: (props) => props.getValue() ?? "N/A"
  }),
  columnHelper.display({
    id: "actions",
    cell: (props) => <DataTableRowActions entry={props.row.original} />,
  }),
];
