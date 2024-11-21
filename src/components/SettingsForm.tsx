import { useForm } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { useUpdateUserLocation } from "@/hooks/queries";
import { z } from "zod";

const userLocationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  latitude: z.string().min(1, "Latitude is required"),
  longitude: z.string().min(1, "Longitude is required"),
  timezone: z.string().min(1, "Timezone is required"),
});

const SettingsForm = () => {
  const updateUserLocation = useUpdateUserLocation();

  const form = useForm({
    defaultValues: {
      name: "",
      latitude: "",
      longitude: "",
      timezone: "",
    },
    validators: {
      onChange: userLocationSchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      updateUserLocation.mutate({
        userId: 1, // Assuming a single user for simplicity
        latitude: parseFloat(value.latitude),
        longitude: parseFloat(value.longitude),
        timezone: value.timezone,
      });
      formApi.reset();
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div>
        <Label htmlFor="name">Name</Label>
        <form.Field
          name="name"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>
      <div>
        <Label htmlFor="latitude">Latitude</Label>
        <form.Field
          name="latitude"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                id="latitude"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>
      <div>
        <Label htmlFor="longitude">Longitude</Label>
        <form.Field
          name="longitude"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                id="longitude"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>
      <div>
        <Label htmlFor="timezone">Timezone</Label>
        <form.Field
          name="timezone"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                id="timezone"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>
      <Button type="submit">Save</Button>
    </form>
  );
};

export default SettingsForm;
