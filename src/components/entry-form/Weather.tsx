import { Label } from "@/components/ui/label";
import { CreateEntry } from "@/schema";
import { ReactFormApi, Validator } from "@tanstack/react-form";
import { Input } from "../ui/input";

interface Props {
  form: ReactFormApi<CreateEntry, Validator<CreateEntry>>;
}

export function Weather({ form }: Props) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="weather.temperature_high">Temp High</Label>
        <form.Field
          name="weather.temperature_high"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                value={field.state.value || undefined}
                type="number"
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
                value={field.state.value || undefined}
                type="number"
                onChange={(e) => field.handleChange(Number(e.target.value))}
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
                value={field.state.value || undefined}
                type="text"
                onChange={(e) => field.handleChange(e.target.value)}
              ></Input>
            </div>
          )}
        />
      </div>
    </div>
  );
}
