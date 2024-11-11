import { useState } from "react";
import { BasicInfo } from "./BasicInfo";
import { PainDetails } from "./PainDetails";
import { Symptoms } from "./Symptoms";
import { Warnings } from "./Warnings";
import { Factors } from "./Factors";
import { OtherDetails } from "./OtherDetails";
import { Button } from "../ui/button";
import { useCreateEntry } from "../../hooks/queries";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardContent, CardFooter } from "../ui/card";
import { format } from "date-fns";
import { useForm } from "@tanstack/react-form";
import {
  CreateEntry,
  createEntrySchema,
  PainSite,
  Symptom,
  Warning,
} from "@/schema";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DateTimePicker, TimePicker } from "../ui/datetime-picker";

export default function EntryForm() {
  const createEntry = useCreateEntry();
  const [activeTab, setActiveTab] = useState("basic-info");
  const form = useForm({
    defaultValues: {
      start_date: new Date().toDateString(),
      start_time: "",
      end_time: null,
      headache_severity: null,
      hydration_oz: null,
      symptoms: [] as Symptom[],
      warnings: [] as Warning[],
      painSites: [] as PainSite[],
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
      createEntry.mutate({
        entry: {
          ...value,
          symptoms: undefined,
          warnings: undefined,
          painSites: undefined,
        },
        symptomIds: value.symptoms.map((s) => s.id),
        warningIds: value.warnings.map((w) => w.id),
        painSiteIds: value.painSites.map((p) => p.id),
      });
    },
  });

  const tabs = [
    { id: "basic-info", label: "Basic Info", component: BasicInfo },
    { id: "pain-details", label: "Pain Details", component: PainDetails },
    { id: "symptoms", label: "Symptoms", component: Symptoms },
    { id: "warnings", label: "Warnings", component: Warnings },
    { id: "factors", label: "Factors", component: Factors },
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
                {tab.id === "basic-info" && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Start time</Label>
                        <form.Field
                          name="start_time"
                          children={(field) => (
                            <div className="flex space-x-2 items-center">
                            <DateTimePicker
                              granularity="minute"
                              className="w-min"
                              hourCycle={12}
                              value={
                                field.state.value
                                  ? new Date(field.state.value)
                                  : undefined
                              }
                              onChange={(e) =>
                                e && field.handleChange(e.toISOString())
                              }
                            ></DateTimePicker>
                            <Button onClick={() => field.handleChange(new Date().toISOString())} >Now</Button></div>
                          )}
                        />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_time">End time</Label>
                      <div className="flex space-x-2 items-center">
                        <form.Field
                          name="end_time"
                          children={(field) => (
                            <DateTimePicker
                              className="w-min"
                              hourCycle={12}
                              granularity="minute"
                              onChange={(e) => {
                                e && field.handleChange(e.toISOString());
                              }}
                              value={
                                field.state.value
                                  ? new Date(field.state.value)
                                  : undefined
                              }
                            />
                          )}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
                  <Button type="submit" disabled={createEntry.isPending}>
                    {createEntry.isPending ? "Saving..." : "Save Entry"}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
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
