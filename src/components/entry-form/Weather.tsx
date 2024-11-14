import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { CreateEntry } from '@/schema';
import { FormApi, ReactFormApi, Validator } from "@tanstack/react-form"
import { DateTimePicker } from "../ui/datetime-picker"
import { Slider } from "../ui/slider"
import { usePainSites, useSymptoms, useWarnings } from "@/hooks/queries"
import MultipleSelector, { Option } from "../ui/multiple-selector"
import { Input } from "../ui/input";

interface Props {
  form: ReactFormApi<CreateEntry, Validator<CreateEntry>>
}

export function Weather({ form }: Props) {

  const symptomQuery = useSymptoms()
  const warningsQuery = useWarnings()
  const painSiteQuery = usePainSites()

  const toOptionList = (l: {
    id: number;
    name: string;
}[]) => {
    return l.map(p => ({label: p.name, value: p.name} as Option))
  }


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
  const fromOptionList = (options: Option[], queryResult: {
    id: number;
    name: string;
}[]) => {
    if (!queryResult) return []
    return queryResult.filter(item => 
      options.some(option => option.value === item.name)
    )
}
  return (
    <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="weather.temperature_high">Temp High</Label>
                      <form.Field
                        name="weather.temperature_high"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
                            <Input
                              value={
                                field.state.value || undefined
                              }
                              type="number"
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                            ></Input>
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="weather.temperature_low">Temp Low</Label>
                      <form.Field
                        name="weather.temperature_low"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
                            <Input
                              value={
                                field.state.value || undefined
                              }
                              type="number"
                              onChange={(e) =>
                                field.handleChange(Number(e.target.value))
                              }
                            ></Input>
                          </div>
                        )}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="start_time">Type</Label>
                      <form.Field
                        name="weather.type"
                        children={(field) => (
                          <div className="flex space-x-2 items-center">
                            <Input
                              value={
                                field.state.value || undefined
                              }
                              type="text"
                              onChange={(e) =>
                                field.handleChange(e.target.value)
                              }
                            ></Input>
                          </div>
                        )}
                      />
                    </div>
                  </div>
  );
};
