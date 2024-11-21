// import { useForm } from "react-hook-form";
import { useForm } from "@tanstack/react-form";
import { createManagementStepSchema, CreateManagementStep } from "../schema";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { DateTimePicker } from "./ui/datetime-picker";
import { useCreateManagementStep } from "@/hooks/queries";
// import { Button, Input, Textarea } from "shadcn";

const ManagementStepLogger = () => {

  const createManagementStep = useCreateManagementStep();

  const form = useForm({
    defaultValues: {
      name: "",
      time: "",
      amount: 0,
      unit: "",
      notes: "",
    } as CreateManagementStep,
    validators: {
      onChange: createManagementStepSchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      // Do something with form data
      console.log(value);
      await createManagementStep.mutateAsync(value);
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
        <Label htmlFor="time">Time</Label>
        <form.Field
          name="time"
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
              />
              {/* <Input id="time" value={field.state.value} onChange={e => field.handleChange(e.target.value)} /> */}
            </div>
          )}
        />
      </div>
      <div>
        <Label htmlFor="amount">Amount</Label>
        <form.Field
          name="amount"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                id="amount"
                value={field.state.value}
                onChange={(e) => field.handleChange(Number(e.target.value))}
              />
            </div>
          )}
        />
      </div>
      <div>
        <Label htmlFor="unit">Unit</Label>
        <form.Field
          name="unit"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Input
                id="unit"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>
      <div>
        <Label htmlFor="notes">Notes</Label>
        <form.Field
          name="notes"
          children={(field) => (
            <div className="flex space-x-2 items-center">
              <Textarea
                id="notes"
                value={[field.state.value ?? ""]}
                onChange={(e) => field.handleChange(e.target.value)}
              />
            </div>
          )}
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default ManagementStepLogger;
