import { colorCodes } from "@/components/entry-table/columns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useGetEntry } from "@/hooks/queries";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const EntryView = () => {
  const { entryId } = Route.useParams();
  const {
    data: entry,
    error,
    isLoading,
  } = useGetEntry(Number(entryId))
  return (
    <>
      <div className="container mx-auto p-4">
        {isLoading ? (
          <div className="text-center">Loading...</div>
        ) : error ? (
          <div className="text-center text-red-500">Error: {error.message}</div>
        ) : entry ? (
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">
              {new Date(entry.start_time || "").toDateString()}
            </h1>

            <Card>
              <CardHeader>
                <CardTitle>Pain Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Pain Level:</p>
                    <Badge
                      color="red"
                      className={`${colorCodes(entry.headache_severity)}`}
                    >
                      {entry.headache_severity}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-semibold">Locations:</p>
                    <ul className="list-disc list-inside">
                      {entry.painSites.map(painSite => 
                        <li key={painSite.id}>{painSite.name}</li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Symptoms</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  {
                    entry.symptoms.map(symptoms => <li key={symptoms.id}>{symptoms.name}</li>)
                  }
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside">
                  {
                    entry.warnings.map(warning => <li key={warning.id}>{warning.name}</li>)
                  }
                  <li>{entry.warning_other}</li>
                </ul>
              </CardContent>
            </Card>
            {/* <Card>
              <CardHeader>
                <CardTitle>Warnings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold">Triggers:</p>
                    <ul className="list-disc list-inside">
                      {entry.factors_brought_on &&
                        entry.factors_brought_on
                          .split(",")
                          .map((trigger, index) => (
                            <li key={index}>{trigger}</li>
                          ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold">Relieving Factors:</p>
                    <ul className="list-disc list-inside">
                      {entry.factors_relieve &&
                        entry.factors_relieve
                          .split(",")
                          .map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card> */}
          </div>
        ) : (
          <div className="text-center">No entry found</div>
        )}
      </div>
    </>
  );
};

export default EntryView;

export const Route = createFileRoute("/entries/$entryId")({
  component: EntryView,
});
