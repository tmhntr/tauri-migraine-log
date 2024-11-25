import { colorCodes } from "@/components/entry-table/columns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useDocument } from "@/hooks/document";
// import { useGetEntry } from "@/hooks/queries";
import { createFileRoute } from "@tanstack/react-router";

const EntryView = () => {
  const { entryId } = Route.useParams();
  // const { data: entry, error, isLoading } = useGetEntry(Number(entryId));
  const [doc, _] = useDocument();

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const entry = doc?.entries.find(e => e.id === entryId);

  return (
    <div className="container mx-auto p-4">
      {/* {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : error ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : entry ? ( */}
      {entry ? (
        <div className="space-y-6">
          <h1 className="text-3xl font-bold mb-6">
            Migraine Episode Report -{" "}
            {new Date(entry.start_time).toDateString()}
          </h1>

          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Episode Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <strong>Start:</strong> {formatDateTime(entry.start_time)}
              </div>
              {entry.end_time && (
                <div>
                  <strong>End:</strong> {formatDateTime(entry.end_time)}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Symptoms Section */}
          <Card>
            <CardHeader>
              <CardTitle>Symptoms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Warnings Subsection */}
              <div>
                <h3 className="font-semibold mb-2">Warnings</h3>
                <ul className="list-disc list-inside">
                  {entry.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                  {entry.warning_other && (
                    <li className="text-gray-600">{entry.warning_other}</li>
                  )}
                </ul>
              </div>

              {/* Severity Subsection */}
              <div>
                <h3 className="font-semibold mb-2">Severity</h3>
                <Badge className={`${colorCodes(entry.headache_severity)}`}>
                  {entry.headache_severity}
                </Badge>
              </div>

              {/* Pain Locations */}
              <div>
                <h3 className="font-semibold mb-2">Pain Locations</h3>
                <ul className="list-disc list-inside">
                  {entry.pain_sites.map((site, i) => (
                    <li key={i}>{site}</li>
                  ))}
                </ul>
              </div>

              {/* Associated Symptoms */}
              <div>
                <h3 className="font-semibold mb-2">Associated Symptoms</h3>
                <ul className="list-disc list-inside">
                  {entry.symptoms.map((symptom, i) => (
                    <li key={i}>{symptom}</li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              {entry.notes && (
                <div>
                  <h3 className="font-semibold mb-2">Notes</h3>
                  <p className="text-gray-600">{entry.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Other Details Card */}
          <Card>
            <CardHeader>
              <CardTitle>Other Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Hydration */}
              {entry.hydration_oz && (
                <div>
                  <h3 className="font-semibold mb-2">Hydration</h3>
                  <p>{entry.hydration_oz} oz</p>
                </div>
              )}

              {/* Sleep */}
              {entry.recent_duration_of_sleep && (
                <div>
                  <h3 className="font-semibold mb-2">Sleep</h3>
                  <p>{entry.recent_duration_of_sleep} hours</p>
                </div>
              )}

              {/* Weather */}
              {entry.weather && (
                <div>
                  <h3 className="font-semibold mb-2">Weather</h3>
                  <div className="space-y-1">
                    <p>Type: {entry.weather.type}</p>
                    {entry.weather.temperature_high && (
                      <p>High: {entry.weather.temperature_high}°F</p>
                    )}
                    {entry.weather.temperature_low && (
                      <p>Low: {entry.weather.temperature_low}°F</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center">No entry found</div>
      )}
    </div>
  );
};

export default EntryView;

export const Route = createFileRoute("/entries/$entryId")({
  component: EntryView,
});
