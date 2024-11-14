import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CreateEntry } from "@/schema";
import { FormApi, ReactFormApi, Validator } from "@tanstack/react-form";
import { DateTimePicker } from "../ui/datetime-picker";
import { Slider } from "../ui/slider";
import { usePainSites, useSymptoms, useWarnings } from "@/hooks/queries";
import MultipleSelector, { Option } from "../ui/multiple-selector";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Props {
  form: ReactFormApi<CreateEntry, Validator<CreateEntry>>;
}

export function OtherDetails({ form }: Props) {
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
        <Label htmlFor="notes">Notes</Label>
        <form.Field
          name="notes"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Textarea
                value={field.state.value || undefined}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.handleChange(e.target.value);
                }}
              ></Textarea>
            </div>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="recent_duration_of_sleep">
          Recent duration of sleep
        </Label>
        <form.Field
          name="recent_duration_of_sleep"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                type="number"
                value={field.state.value || undefined}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.handleChange(Number(e.target.value));
                }}
              ></Input>
            </div>
          )}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="hydration_oz">Hydration (oz)</Label>
        <form.Field
          name="hydration_oz"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                type="number"
                value={field.state.value || undefined}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.handleChange(Number(e.target.value));
                }}
              ></Input>
            </div>
          )}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recent_duration_of_sleep">
          Recent duration of sleep (hours)
        </Label>
        <form.Field
          name="recent_duration_of_sleep"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                type="number"
                value={field.state.value || undefined}
                onChange={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.handleChange(Number(e.target.value));
                }}
              ></Input>
            </div>
          )}
        />
      </div>
    </div>
  );
}
