import { Label } from "@/components/ui/label";
import { CreateEntry } from "@/schema";
import { ReactFormApi, Validator } from "@tanstack/react-form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

interface Props {
  form: ReactFormApi<CreateEntry, Validator<CreateEntry>>;
}

export function OtherDetails({ form }: Props) {
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
    </div>
  );
}
