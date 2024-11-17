import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Database from "@tauri-apps/plugin-sql";
import {
  CreateEntry,
  CreateWeather,
  EntryData,
  PainSite,
  Symptom,
  Warning,
} from "../schema";

// Database connection helper
const getDb = async () => await Database.load("sqlite:database.sqlite");

// Query keys
export const queryKeys = {
  entries: ["entries"] as const,
  entry: (id: number) => ["entry", id] as const,
  painSites: ["painSites"] as const,
  symptoms: ["symptoms"] as const,
  warnings: ["warnings"] as const,
  painSitesForEntry: (entryId: number) => ["painSites", entryId] as const,
  symptomsForEntry: (entryId: number) => ["symptoms", entryId] as const,
  warningsForEntry: (entryId: number) => ["warnings", entryId] as const,
};

// Reference data queries
export const usePainSites = () => {
  return useQuery({
    queryKey: queryKeys.painSites,
    queryFn: async () => {
      const db = await getDb();
      return await db.select<PainSite[]>("SELECT * FROM PainSite");
    },
  });
};

export const useSymptoms = () => {
  return useQuery({
    queryKey: queryKeys.symptoms,
    queryFn: async () => {
      const db = await getDb();
      return await db.select<Symptom[]>("SELECT * FROM Symptom");
    },
  });
};

export const useWarnings = () => {
  return useQuery({
    queryKey: queryKeys.warnings,
    queryFn: async () => {
      const db = await getDb();
      return await db.select<Warning[]>("SELECT * FROM Warning");
    },
  });
};

// Get Entry
export const useGetEntry = (id: number) => {
  return useQuery({
    queryKey: queryKeys.entry(id),
    queryFn: async () => {
      const db = await getDb();
      const entries = await db.select<EntryData[]>(
        "SELECT * FROM Entry WHERE id = ?",
        [id],
      );

      if (entries.length === 0) {
        throw new Error("Entry not found");
      }

      const entry = entries[0];

      // Get related data
      const painSites = await db.select(
        `SELECT PainSite.* FROM PainSite 
         JOIN PainSiteEntry ON PainSite.id = PainSiteEntry.pain_site_id 
         WHERE PainSiteEntry.entry_id = ?`,
        [id],
      );

      const symptoms = await db.select(
        `SELECT Symptom.* FROM Symptom
         JOIN SymptomEntry ON Symptom.id = SymptomEntry.symptom_id
         WHERE SymptomEntry.entry_id = ?`,
        [id],
      );

      const warnings = await db.select(
        `SELECT Warning.* FROM Warning
         JOIN WarningEntry ON Warning.id = WarningEntry.warning_id
         WHERE WarningEntry.entry_id = ?`,
        [id],
      );

      return {
        ...entry,
        pain_sites: painSites,
        symptoms,
        warnings,
      } as EntryData;
    },
  });
};

// List entries
export const useListEntries = () => {
  return useQuery({
    queryKey: queryKeys.entries,
    queryFn: async () => {
      const db = await getDb();
      const entries = await db.select<EntryData[]>("SELECT * FROM Entry");
      return entries;
    },
  });
};

const useCreateWeather = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (weather: CreateWeather) => {
      const db = await getDb();
      const result = await db.execute(
        "INSERT INTO Weather (type, temperature_high, temperature_low) VALUES (?, ?, ?)",
        [weather.type, weather.temperature_high, weather.temperature_low],
      );
      return result.lastInsertId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

// Entry mutations
export const useCreateEntry = () => {
  const queryClient = useQueryClient();
  const createWeather = useCreateWeather();

  return useMutation({
    mutationFn: async (entry: CreateEntry) => {
      const weatherId = entry.weather
        ? await createWeather.mutateAsync(entry.weather)
        : null;

      const db = await getDb();

      // Insert the main entry
      const result = await db.execute(
        "INSERT INTO Entry (start_time, end_time, notes, recent_duration_of_sleep, headache_severity, hydration_oz, weather_id, warning_other) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          entry.start_time,
          entry.end_time,
          entry.notes,
          entry.recent_duration_of_sleep,
          entry.headache_severity,
          entry.hydration_oz,
          weatherId,
          entry.warning_other,
        ],
      );

      const entryId = result.lastInsertId;

      // Insert pain site relations
      for (const painSite of entry.pain_sites) {
        await db.execute(
          "INSERT INTO PainSiteEntry (entry_id, pain_site_id) VALUES (?, ?)",
          [entryId, painSite.id],
        );
      }

      // Insert symptom relations
      for (const symptom of entry.symptoms) {
        await db.execute(
          "INSERT INTO SymptomEntry (entry_id, symptom_id) VALUES (?, ?)",
          [entryId, symptom.id],
        );
      }

      // Insert warning relations
      for (const warning of entry.warnings) {
        await db.execute(
          "INSERT INTO WarningEntry (entry_id, warning_id) VALUES (?, ?)",
          [entryId, warning.id],
        );
      }

      return entryId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const db = await getDb();

      // Delete relations first due to foreign key constraints
      await db.execute("DELETE FROM PainSiteEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM SymptomEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM WarningEntry WHERE entry_id = ?", [id]);

      // Delete the entry
      await db.execute("DELETE FROM Entry WHERE id = ?", [id]);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

export const useUpdateEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      entry,
      painSiteIds,
      symptomIds,
      warningIds,
    }: {
      id: number;
      entry: Partial<Entry>;
      painSiteIds: number[];
      symptomIds: number[];
      warningIds: number[];
    }) => {
      const db = await getDb();

      // Update entry
      const keys = Object.keys(entry);
      const query = `UPDATE Entry SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(", ")} WHERE id = $${keys.length + 1}`;
      await db.execute(query, [
        ...keys.map((key) => entry[key as keyof Entry]),
        id,
      ]);

      // Update relations by removing old ones and inserting new ones
      await db.execute("DELETE FROM PainSiteEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM SymptomEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM WarningEntry WHERE entry_id = ?", [id]);

      for (const painSiteId of painSiteIds) {
        await db.execute(
          "INSERT INTO PainSiteEntry (entry_id, pain_site_id) VALUES (?, ?)",
          [id, painSiteId],
        );
      }

      for (const symptomId of symptomIds) {
        await db.execute(
          "INSERT INTO SymptomEntry (entry_id, symptom_id) VALUES (?, ?)",
          [id, symptomId],
        );
      }

      for (const warningId of warningIds) {
        await db.execute(
          "INSERT INTO WarningEntry (entry_id, warning_id) VALUES (?, ?)",
          [id, warningId],
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

export const useGetEpisodeCount = (start_date: Date, end_date: Date) => {
  return useQuery({
    queryKey: ["episodeCount", start_date, end_date],
    queryFn: async () => {
      const db = await getDb();
      const result = await db.select<[{ count: number }]>(
        `SELECT COUNT(start_time) as count 
         FROM Entry 
         WHERE start_time >= ? AND start_time <= ?`,
        [
          start_date.toISOString(),
          end_date.toISOString(),
        ],
      );
      return result[0].count;
    },
  });
};
