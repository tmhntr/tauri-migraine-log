import { useForm } from "@tanstack/react-form";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
// import { useUpdateUserLocation, useUpdateUser } from "@/hooks/queries";
import { createUserSchema, createLocationSchema, User } from "@/schema";
import { store } from "@/main";
import { useStore } from "@tanstack/react-store";
import { useNavigate } from "@tanstack/react-router";
import { useDocument } from "@/hooks/document";

const useUserOrNavigate = () => {
  const user = useStore(store, (s) => s.user);
  const navigate = useNavigate();
  if (!user) {
    navigate({ to: "/login" });
  }
  return user as User;
};

const UserForm = () => {
  // const updateUser = useUpdateUser();
  const [doc, changeDoc] = useDocument();

  const user = useStore(store, (s) => s.user);

  const form = useForm({
    defaultValues: {
      name: user?.name,
    },
    validators: {
      onChange: createUserSchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      user && changeDoc((d) => {
        if (d.users.length > 0) 
          d.users[0].name = value.name as string;
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
      <Button type="submit">Save</Button>
    </form>
  );
};

const UserLocationForm = () => {
  // const updateUserLocation = useUpdateUserLocation();
  const [doc, changeDoc] = useDocument();

  const form = useForm({
    defaultValues: {
      latitude: "",
      longitude: "",
      timezone: "",
      city: "",
    },
    validators: {
      onChange: createLocationSchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      // updateUserLocation.mutate({
      //   userId: 1, // Assuming a single user for simplicity
      //   latitude: parseFloat(value.latitude),
      //   longitude: parseFloat(value.longitude),
      //   timezone: value.timezone,
      // });
      changeDoc((d) => {
        d.users[0].location = {
          id: crypto.randomUUID(),
          latitude: parseFloat(value.latitude),
          longitude: parseFloat(value.longitude),
          timezone: value.timezone,
          name: value.city,
        };
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
        <Label htmlFor="city">City</Label>
        <form.Field
          name="city"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="Enter city name"
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    const response = await fetch(
                      `http://api.openweathermap.org/geo/1.0/direct?q=${field.state.value}&appid=2abba5469d642e9c655beaaa87a929c6`,
                    );
                    const data = await response.json();
                    field.form.setFieldValue("latitude", data[0].lat);
                    field.form.setFieldValue("longitude", data[0].lon);
                    field.form.setFieldValue("timezone", data[0].timezone);
                  }
                }}
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

export { UserForm, UserLocationForm };
