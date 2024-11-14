import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreateEntry } from "@/schema";
import { FormApi, ReactFormApi, Validator } from "@tanstack/react-form";
import { DateTimePicker } from "../ui/datetime-picker";
import { Slider } from "../ui/slider";
import { usePainSites, useSymptoms, useWarnings } from "@/hooks/queries";
import MultipleSelector, { Option } from "../ui/multiple-selector";

interface Props {
  form: ReactFormApi<CreateEntry, Validator<CreateEntry>>;
}

export function BasicInfo({ form }: Props) {
  const symptomQuery = useSymptoms();
  const warningsQuery = useWarnings();
  const painSiteQuery = usePainSites();

  const toOptionList = (
    l: {
      id: number;
      name: string;
    }[]
  ) => {
    return l.map((p) => ({ label: p.name, value: p.name }) as Option);
  };

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
  const fromOptionList = (
    options: Option[],
    queryResult: {
      id: number;
      name: string;
    }[]
  ) => {
    if (!queryResult) return [];
    return queryResult.filter((item) =>
      options.some((option) => option.value === item.name)
    );
  };
  return (
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
                  field.state.value ? new Date(field.state.value) : undefined
                }
                onChange={(e) => e && field.handleChange(e.toISOString())}
              ></DateTimePicker>
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  field.handleChange(new Date().toISOString());
                }}
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
                  field.state.value ? new Date(field.state.value) : undefined
                }
              />
              <Button
                onClick={() => field.handleChange(new Date().toISOString())}
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
            <Label htmlFor="headache_severity">Headache severity</Label>

            <div className="flex space-x-4">
              <Slider
                className="max-w-md py-4"
                value={[painLevelIndex(field.state.value)]}
                min={0}
                max={3}
                onValueChange={(e) => field.handleChange(painLevels[e[0]])}
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
              <MultipleSelector
                value={toOptionList(field.state.value)}
                onChange={(o) =>
                  field.handleChange(
                    fromOptionList(o, painSiteQuery.data || [])
                  )
                }
                options={toOptionList(painSiteQuery.data || [])}
              />
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
              <MultipleSelector
                value={toOptionList(field.state.value)}
                onChange={(o) =>
                  field.handleChange(fromOptionList(o, symptomQuery.data || []))
                }
                options={toOptionList(symptomQuery.data || [])}
              />
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
              <MultipleSelector
                value={toOptionList(field.state.value)}
                onChange={(o) =>
                  field.handleChange(
                    fromOptionList(o, warningsQuery.data || [])
                  )
                }
                options={toOptionList(warningsQuery.data || [])}
              />
            </div>
          )}
        />
      </div>
    </div>
  );
}
