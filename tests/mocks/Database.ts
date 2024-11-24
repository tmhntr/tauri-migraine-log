import TauDB from "@tauri-apps/plugin-sql";
import { exec } from "child_process";
import { Mock, vi } from "vitest";

type Connection = { execute: Mock, select: Mock };

export const mockDatabase = () => {
  let connection
  vi.mock("@tauri-apps/plugin-sql", () => {
    connection = {
        execute: vi.fn(),
        select: vi.fn(),
    }

    const Database = {
      load: async (_: string) => connection as Connection,
    };
    // Database.prototype.load = vi.fn().mockResolvedValue(db);

    return { default: Database };
  });
};
