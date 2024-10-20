import { createColumnHelper } from "@tanstack/react-table";
import { EntryType } from "../../schema";
import { DataTableRowActions } from "./data-table-row-actions";
import { Badge } from "../ui/badge";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
const getEntrySymptoms = (entry: EntryType) => {
  const symptoms = [];
  entry.symptoms_aura && symptoms.push("aura");
  entry.symptoms_burning && symptoms.push("burning");
  entry.symptoms_dull_ache && symptoms.push("dull ache");
  entry.symptoms_knife_like && symptoms.push("knife-like");
  entry.symptoms_light_sensitivity && symptoms.push("light sensitivity");
  entry.symptoms_nausea && symptoms.push("nausea");
  entry.symptoms_neck_ache && symptoms.push("neck ache");
  entry.symptoms_pressure && symptoms.push("pressure");
  entry.symptoms_throbbing && symptoms.push("throbbing");
  entry.symptoms_tight_band && symptoms.push("tight band");
  return symptoms.join(", ");
};

export const colorCodes = (severity: EntryType["headache_severity"]) => {
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

const columnHelper = createColumnHelper<EntryType>();

export const columns = [
  columnHelper.accessor("episode_date", {
    header: "Date",
    cell: (row) => {const date = row.getValue();
      return date ? `${new Date(date).toDateString()}` : ''},
  }),
  columnHelper.accessor("headache_severity", {
    header: "Severity",
    cell: (props) => (
          <Badge
            className={colorCodes(props.getValue())}
          >
            {props.getValue()}
          </Badge>
        ),
  }),
  columnHelper.accessor((row) => `${getEntrySymptoms(row)}`, {
    id: 'symptoms',
  }),
  {
    id: "factors_brought_on",
    header: "Triggers",
  },
  {
    id: "factors_relieve",
    header: "Relief Factors",
  },
  columnHelper.display({
    id: 'actions',
    cell: (row) => <DataTableRowActions entry={row.row.original} />,
  }),
];
