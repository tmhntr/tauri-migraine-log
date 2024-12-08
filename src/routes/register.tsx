import { createFileRoute } from '@tanstack/react-router'
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { createUserSchema } from "@/schema";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { v4 as uuidv4 } from "uuid";
import { useDocument } from "@/hooks/document";

export const Route = createFileRoute('/register')({
  component: RouteComponent,
})

function RouteComponent() {
  const [doc, changeDoc] = useDocument();
  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: createUserSchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      changeDoc((d) => {
        d.users.push({ id: uuidv4(), name: value.name, location: null });
      });
      formApi.reset();
    },
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-center">Register</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-4"
          >
            <div>
              <form.Field
                name="name"
                children={(field) => (
                  <div className="flex flex-col space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-medium text-gray-700"
                    >
                      User Name
                    </label>
                    <Input
                      id="name"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Enter user name"
                      className="p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                )}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md"
            >
              Register
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
