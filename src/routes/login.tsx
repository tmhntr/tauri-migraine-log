import * as React from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useListUsers, useCreateUser } from "@/hooks/queries";
import { store } from "@/main";
import { createUserSchema, User } from "@/schema";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/login")({
  component: Login,
});

export function Login() {
  const { data: users, isLoading, isError } = useListUsers();
  const createUserMutation = useCreateUser();
  const navigate = useNavigate();
  const [isCreatingUser, setIsCreatingUser] = React.useState(false);

  const handleUserSelect = (user: User) => {
    store.setState((state) => {
      return {
        ...state,
        user,
      };
    });
    navigate({ to: "/" });
  };

  const form = useForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onChange: createUserSchema,
    },
    validatorAdapter: zodValidator(),
    onSubmit: async ({ value, formApi }) => {
      createUserMutation.mutate(value.name, {
        onSuccess: (userId) => {
          const newUser = { id: userId, name: value.name };
          handleUserSelect(newUser);
        },
      });
      formApi.reset();
    },
  });

  if (isError) {
    return <div>Error loading users</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4">
        <CardHeader>
          <CardTitle className="text-center">
            {isCreatingUser ? "Create a New User" : "Select a User"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isCreatingUser ? (
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
                        New User Name
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
                Create User
              </Button>
            </form>
          ) : users?.length ? (
            <ul className="space-y-2">
              {users.map((user) => (
                <li
                  key={user.id}
                  className="p-2 bg-white rounded shadow cursor-pointer hover:bg-gray-100"
                  onClick={() => handleUserSelect(user)}
                >
                  {user.name}
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500">No users available</div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => setIsCreatingUser(!isCreatingUser)}>
            {isCreatingUser ? "Back to Login" : "Create New User"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
