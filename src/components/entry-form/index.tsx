import { useState } from "react";
import { BasicInfo } from "./BasicInfo";
import { OtherDetails } from "./OtherDetails";
import { Button } from "../ui/button";
import { useCreateEntry } from "../../hooks/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardFooter } from "../ui/card";
import { useForm } from "@tanstack/react-form";
import {
  CreateEntry,
  createEntrySchema,
  PainSite,
  Symptom,
  Warning,
} from "@/schema";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Weather } from "./Weather";
import { useNavigate } from "@tanstack/react-router";

export default function EntryForm() {
  const createEntry = useCreateEntry();
  const [activeTab, setActiveTab] = useState("basic-info");
  const navigate = useNavigate({from: '/create'})

  const form = useForm({
    defaultValues: {
      start_time: new Date().toDateString(),
      end_time: null,
      headache_severity: null,
      hydration_oz: null,
      symptoms: [] as Symptom[],
      warnings: [] as Warning[],
      pain_sites: [] as PainSite[],
      notes: "",
      recent_duration_of_sleep: null,
      warning_other: "",
      weather: null,
    } as CreateEntry,
    validators: {
      onChange: createEntrySchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value }) => {
      // Do something with form data
      console.log(value);
      const entryId = await createEntry.mutateAsync(value);
      navigate({to: `/entries/$entryId`, params: {entryId: entryId.toString()}} )
    },
  });

  form;

  const tabs = [
    { id: "basic-info", label: "Basic Info", component: BasicInfo },
    { id: "weather", label: "Weather", component: Weather },
    { id: "other-details", label: "Other Details", component: OtherDetails },
  ];

  const handleNext = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1].id);
    }
  };

  const handlePrevious = () => {
    const currentIndex = tabs.findIndex((tab) => tab.id === activeTab);
    if (currentIndex > 0) {
      setActiveTab(tabs[currentIndex - 1].id);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="my-8 mx-8 space-y-4"
      >
        <TabsList className="grid w-full grid-cols-6">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.id} value={tab.id}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <Card>
              <CardContent className="space-y-4 pt-6">
                <tab.component form={form} />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={tab.id === tabs[0].id}
                >
                  Previous
                </Button>
                {tab.id === tabs[tabs.length - 1].id ? (
                  <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                      <Button type="submit" disabled={!canSubmit}>
                        {isSubmitting ? "Saving..." : "Save Entry"}
                      </Button>
                    )}
                  />
                ) : (
                  // <Button type="submit" disabled={createEntry.isPending}>
                  //   {createEntry.isPending ? "Saving..." : "Save Entry"}
                  // </Button>
                  <Button
                    type="button"
                    variant={"outline"}
                    onClick={handleNext}
                  >
                    Next
                  </Button>
                )}
              </CardFooter>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </form>
  );
}
