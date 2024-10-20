import { colorCodes } from "@/components/entry-table/columns";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { getEntry } from "@/db";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

const EntryView = () => {
  const { entryId } = Route.useParams();
  const {
    data: entry,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["entry", "entries"],
    queryFn: () => getEntry(Number(entryId)),
  });
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
              {new Date(entry.episode_date || "").toDateString()}
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
                      {entry.site_of_pain_back && <li>Back</li>}
                      {entry.site_of_pain_front && <li>Front</li>}
                      {entry.site_of_pain_left && <li>Left</li>}
                      {entry.site_of_pain_right && <li>Right</li>}
                      {entry.site_of_pain_top && <li>Top</li>}
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
                  {entry.symptoms_aura && <li>Aura</li>}
                  {entry.symptoms_burning && <li>Burning</li>}
                  {entry.symptoms_dull_ache && <li>Dull Ache</li>}
                  {entry.symptoms_knife_like && <li>Knife-like</li>}
                  {entry.symptoms_light_sensitivity && (
                    <li>Light Sensitivity</li>
                  )}
                  {entry.symptoms_nausea && <li>Nausea</li>}
                  {entry.symptoms_neck_ache && <li>Nech Ache</li>}
                  {entry.symptoms_pressure && <li>Pressure</li>}
                  {entry.symptoms_throbbing && <li>Throbbing</li>}
                  {entry.symptoms_tight_band && <li>Tight Band</li>}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Triggers and Factors</CardTitle>
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
            </Card>
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
