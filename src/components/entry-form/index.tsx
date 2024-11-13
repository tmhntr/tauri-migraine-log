import { useState } from "react";
import { BasicInfo } from "./BasicInfo";
import { PainDetails } from "./PainDetails";
import { Symptoms } from "./Symptoms";
import { Warnings } from "./Warnings";
import { Factors } from "./Factors";
import { OtherDetails } from "./OtherDetails";
import { Button } from "../ui/button";
import { useCreateEntry, usePainSites, useSymptoms, useWarnings } from "../../hooks/queries";
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
import { Label } from "../ui/label";
import { DateTimePicker } from "../ui/datetime-picker";
import { Slider } from "../ui/slider";
import MultipleSelector, { Option } from '../ui/multiple-selector';
import { UseQueryResult } from "@tanstack/react-query";

export default function EntryForm() {
  const createEntry = useCreateEntry();
  const [activeTab, setActiveTab] = useState("basic-info");

  const symptomQuery = useSymptoms()
  const warningsQuery = useWarnings()
  const painSiteQuery = usePainSites()

  const toOptionList = (l: {
    id: number;
    name: string;
}[]) => {
    return l.map(p => ({label: p.name, value: p.name} as Option))
  }

  const fromOptionList = (options: Option[], queryResult: {
    id: number;
    name: string;
}[]) => {
    if (!queryResult) return []
    return queryResult.filter(item => 
      options.some(option => option.value === item.name)
    )
}

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
    onSubmit: ({ value }) => {
      // Do something with form data
      console.log(value);
      createEntry.mutate({
        entry: {
          ...value,
          symptoms: undefined,
          warnings: undefined,
          pain_sites: undefined,
        },
        symptomIds: value.symptoms.map((s) => s.id),
        warningIds: value.warnings.map((w) => w.id),
        painSiteIds: value.pain_sites.map((p) => p.id),
      });
    },
  });

  const tabs = [
    { id: "basic-info", label: "Basic Info", component: BasicInfo },
    { id: "weather", label: "Weather", component: Factors },
    { id: "other-details", label: "Other Details", component: OtherDetails },
  ];

  const painLevels = ["Mild", "Moderate", "Severe", "Extreme"] as const;
  const painLevelColors = (painLevel: (typeof painLevels)[number] | null) => {
    switch (painLevel) {
      case "Mild":
        return "bg-green-500";
      case "Moderate":
        return "bg-yellow-400";
      case "Severe":
        return "bg-orange-500";
      case "Extreme":
        return "bg-red-500";
      default:
        return "bg-black-600";
    }
  };

  const painLevelIndex = (painLevel: (typeof painLevels)[number] | null) => {
    return painLevel ? painLevels.findIndex((v) => v === painLevel) : 0;
  };

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
                            <Button
                              onClick={() =>
                                field.handleChange(new Date().toISOString())
                              }
                            >
                              Now
                            </Button>
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="end_time">End time</Label>

                      <form.Field
                        name="end_time"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
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
                            <Button
                              onClick={() =>
                                field.handleChange(new Date().toISOString())
                              }
                            >
                              Now
                            </Button>
                          </div>
                        )}
                      />
                    </div>

                    <form.Field
                      name="headache_severity"
                      children={(field) => (
                        <div className="space-y-2 flex flex-col">
                          <Label htmlFor="headache_severity">
                            Headache severity
                          </Label>

                          <div className="flex space-x-4">
                            <Slider
                              className="max-w-md py-4"
                              value={[painLevelIndex(field.state.value)]}
                              min={0}
                              max={3}
                              onValueChange={(e) =>
                                field.handleChange(painLevels[e[0]])
                              }
                            />
                            <div
                              className={`rounded-sm w-24 p-2 text-white flex items-center justify-center ${painLevelColors(field.state.value)}`}
                            >
                              {field.state.value}
                            </div>
                          </div>
                        </div>
                      )}
                    />
                    <div className="space-y-2">
                      <Label htmlFor="pain_sites">Pain sites</Label>

                      <form.Field
                        name="pain_sites"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
                            <MultipleSelector value={toOptionList(field.state.value)} onChange={o => field.handleChange(fromOptionList(o, painSiteQuery.data || []))} options={toOptionList(painSiteQuery.data || [])} />
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="symptoms">Symptoms</Label>

                      <form.Field
                        name="symptoms"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
                            <MultipleSelector value={toOptionList(field.state.value)} onChange={o => field.handleChange(fromOptionList(o, symptomQuery.data || []))} options={toOptionList(symptomQuery.data || [])} />
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="warnings">Warnings</Label>

                      <form.Field
                        name="warnings"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
                            <MultipleSelector value={toOptionList(field.state.value)} onChange={o => field.handleChange(fromOptionList(o, warningsQuery.data || []))} options={toOptionList(warningsQuery.data || [])} />
                          </div>
                        )}
                      />
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
