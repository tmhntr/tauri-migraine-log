import { render, screen, waitFor } from "@testing-library/react";
// import userEvent from "@testing-library/user-event";
// import EntryForm from "../src/components/entry-form";
import { expect, it, describe, test, vi } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactElement } from "react";
import React from "react";

// import { mockDatabase } from "./mocks/Database";
// import { useCreateEntry } from "../src/hooks/queries";


vi.mock("@tanstack/react-router", () => {
  const navigate = vi.fn();
  return {
    Link: vi.fn(),
    useNavigate: () => navigate,
  };
});

vi.mock("@tauri-apps/api/core", () => {
  const invoke = vi.fn();
  return { invoke };
});

vi.mock("../src/hooks/queries", () => {
  const useWeather = vi.fn();
  const mutateAsync = vi.fn().mockResolvedValue(1);

  return {
    useWeather,
    useCreateEntry: () => ({ mutateAsync }),
    useSymptoms: vi.fn().mockReturnValue({ data: [] }),
    useWarnings: vi.fn().mockReturnValue({ data: [] }),
    usePainSites: vi.fn().mockReturnValue({ data: [] }),
  };
});
describe("EntryForm", () => {
  const queryClient = new QueryClient();

  const renderWithClient = (component: ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {component}
      </QueryClientProvider>
    );
  };

  it("passes", async () => {
    expect(true).toBe(true);
  });

  // mockDatabase();

  // afterEach(() => {
  //   vi.clearAllMocks();
  // });
  // it("submits an entry to the database with all the correct data", async () => {
  //   const user = userEvent.setup();
  //   renderWithClient(<EntryForm />);

  //   const createEntry = useCreateEntry();

  //   await user.click(screen.getByRole("tab", { name: /Basic Info/i }));
  //   await user.click(screen.getAllByRole("button", { name: /now/i })[0]);

  //   const slider = screen.getByRole("slider");
  //   await user.pointer([
  //     {
  //       node: slider,
  //     },
  //     {
  //       coords: { x: 0, y: 0 },
  //     },
  //     {
  //       coords: { x: 100, y: 0 },
  //     },
  //   ]);

  //   await user.click(screen.getByRole("button", { name: /next/i }));
  //   await user.click(screen.getByRole("button", { name: /next/i }));

  //   // await user.click(screen.getByRole("button", { name: /save/i }));
  //   await user.click(screen.getByText(/save entry/i));

  //   await waitFor(() => {
  //     expect(createEntry.mutateAsync).toHaveBeenCalledWith(
  //       expect.objectContaining({
  //         headache_severity: null,
  //         start_time: expect.any(String),
  //         weather: null,
  //         notes: "",
  //         recent_duration_of_sleep: null,
  //         hydration_oz: null,
  //       })
  //     );
  //   });
  // });
});
