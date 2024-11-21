import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Database from "@tauri-apps/plugin-sql";
import {
  CreateEntry,
  CreateWeather,
  EntryData,
  PainSite,
  Symptom,
  Warning,
  ManagementStep,
  CreateManagementStep,
} from "../schema";
import { invoke } from '@tauri-apps/api/core';

// Database connection helper
const getDb = async () => {
  return await Database.load(await invoke<string>("get_db_url", {}));
};

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
  userLocation: (userId: number) => ["userLocation", userId] as const,
  weather: (locationId: number, startDate: string, endDate: string) => 
    ["weather", locationId, startDate, endDate] as const,
  currentWeather: (locationId: number) => ["currentWeather", locationId] as const,
  managementSteps: ["managementSteps"] as const,
  managementStepsForEntry: (entryId: number) => ["managementSteps", entryId] as const,
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

export const useManagementSteps = () => {
  return useQuery({
    queryKey: queryKeys.managementSteps,
    queryFn: async () => {
      const db = await getDb();
      return await db.select<ManagementStep[]>("SELECT * FROM ManagementStep");
    },
  });
};

export const useManagementStepsForEntry = (entryId: number) => {
  return useQuery({
    queryKey: queryKeys.managementStepsForEntry(entryId),
    queryFn: async () => {
      const db = await getDb();
      return await db.select<ManagementStep[]>(
        `SELECT ManagementStep.* FROM ManagementStep
         JOIN ManagementStepEntry ON ManagementStep.id = ManagementStepEntry.management_step_id
         WHERE ManagementStepEntry.entry_id = ?`,
        [entryId],
      );
    },
  });
};

type EntryArrayData = {
  pain_sites: PainSite[];
  symptoms: Symptom[];
  warnings: Warning[]
  management_steps: ManagementStep[];
}

const addEntryArrayData = async (entry: EntryData): Promise<EntryArrayData> => {
  const db = await getDb();
  const painSites = await db.select<PainSite[]>(
    `SELECT PainSite.* FROM PainSite 
     JOIN PainSiteEntry ON PainSite.id = PainSiteEntry.pain_site_id 
     WHERE PainSiteEntry.entry_id = ?`,
    [entry.id],
  );

  const symptoms = await db.select<Symptom[]>(
    `SELECT Symptom.* FROM Symptom
     JOIN SymptomEntry ON Symptom.id = SymptomEntry.symptom_id
     WHERE SymptomEntry.entry_id = ?`,
    [entry.id],
  );

  const warnings = await db.select<Warning[]>(
    `SELECT Warning.* FROM Warning
     JOIN WarningEntry ON Warning.id = WarningEntry.warning_id
     WHERE WarningEntry.entry_id = ?`,
    [entry.id],
  );

  const managementSteps = await db.select<ManagementStep[]>(
    `SELECT ManagementStep.* FROM ManagementStep
     JOIN ManagementStepEntry ON ManagementStep.id = ManagementStepEntry.management_step_id
     WHERE ManagementStepEntry.entry_id = ?`,
    [entry.id],
  );

  return {
    pain_sites: painSites,
    symptoms: symptoms,
    warnings: warnings,
    management_steps: managementSteps,
  };
}

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

      return { ...entry, ...await addEntryArrayData(entry) } as EntryData;
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

      for (const entry of entries) {
        // Get related data
        const arrayData = await addEntryArrayData(entry);
        entry.pain_sites = arrayData.pain_sites;
        entry.symptoms = arrayData.symptoms;
        entry.warnings = arrayData.warnings
        entry.management_steps = arrayData.management_steps;
      } 


      return entries;
    },
  });
};

export const useCreateWeather = () => {
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

export const useCreateManagementStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (managementStep: CreateManagementStep) => {
      const db = await getDb();
      const result = await db.execute(
        "INSERT INTO ManagementStep (name, time, amount, amount_unit, notes) VALUES (?, ?, ?, ?, ?)",
        [managementStep.name, managementStep.time, managementStep.amount, managementStep.unit, managementStep.notes],
      );
      return result.lastInsertId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managementSteps });
    },
  });
};

// Entry mutations
export const useCreateEntry = () => {
  const queryClient = useQueryClient();
  const createWeather = useCreateWeather();
  const createManagementStep = useCreateManagementStep();

  return useMutation({
    mutationFn: async (entry: CreateEntry) => {
      const weatherId = entry.weather
        ? await createWeather.mutateAsync(entry.weather)
        : null;

      // Create management steps
      const managementStepIds = await Promise.all(
        entry.management_steps.map((step) => createManagementStep.mutateAsync(step)),
      );

      // Create entry

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

      // Insert management step relations
      for (const managementStep of entry.management_steps) {
        await db.execute(
          "INSERT INTO ManagementStepEntry (entry_id, management_step_id) VALUES (?, ?)",
          [entryId, managementStep.id],
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
      await db.execute("DELETE FROM ManagementStepEntry WHERE entry_id = ?", [id]);

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
      managementStepIds,
    }: {
      id: number;
      entry: Partial<EntryData>;
      painSiteIds: number[];
      symptomIds: number[];
      warningIds: number[];
      managementStepIds: number[];
    }) => {
      const db = await getDb();

      // Update entry
      const keys = Object.keys(entry);
      const query = `UPDATE Entry SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(", ")} WHERE id = $${keys.length + 1}`;
      await db.execute(query, [
        ...keys.map((key) => entry[key as keyof EntryData]),
        id,
      ]);

      // Update relations by removing old ones and inserting new ones
      await db.execute("DELETE FROM PainSiteEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM SymptomEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM WarningEntry WHERE entry_id = ?", [id]);
      await db.execute("DELETE FROM ManagementStepEntry WHERE entry_id = ?", [id]);

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

      for (const managementStepId of managementStepIds) {
        await db.execute(
          "INSERT INTO ManagementStepEntry (entry_id, management_step_id) VALUES (?, ?)",
          [id, managementStepId],
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

export interface UserLocation {
  id: number;
  user_id: number;
  latitude: number;
  longitude: number;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface WeatherData {
  id: number;
  date: string;
  type: string;
  temperature_high: number;
  temperature_low: number;
  surface_pressure: number;
  precipitation: number;
  wind_speed: number;
  user_location_id: number;
}

export const useUserLocation = (userId: number) => {
  return useQuery({
    queryKey: queryKeys.userLocation(userId),
    queryFn: async () => {
      const db = await getDb();
      const locations = await db.select<UserLocation[]>(
        "SELECT * FROM UserLocation WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
        [userId]
      );
      return locations[0];
    }
  });
};

export const useWeatherData = (locationId: number, startDate: string, endDate: string) => {
  return useQuery({
    queryKey: queryKeys.weather(locationId, startDate, endDate),
    queryFn: async () => {
      const db = await getDb();
      return await db.select<WeatherData[]>(
        `SELECT * FROM Weather 
         WHERE user_location_id = ? 
         AND date BETWEEN ? AND ?
         ORDER BY date ASC`,
        [locationId, startDate, endDate]
      );
    }
  });
};

export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, latitude, longitude, timezone }: 
      { userId: number, latitude: number, longitude: number, timezone: string }) => {
      const db = await getDb();
      const result = await db.execute(
        `INSERT INTO UserLocation (user_id, latitude, longitude, timezone)
         VALUES (?, ?, ?, ?)`,
        [userId, latitude, longitude, timezone]
      );
      return result.lastInsertId;
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.userLocation(userId) });
    }
  });
};

export const useSyncWeatherData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      locationId, 
      latitude, 
      longitude,
      startDate,
      endDate 
    }: {
      locationId: number;
      latitude: number;
      longitude: number;
      startDate: string;
      endDate: string;
    }) => {
      // First get existing dates
      const db = await getDb();
      const existingDates = await db.select<{date: string}[]>(
        `SELECT date FROM Weather 
         WHERE user_location_id = ? 
         AND date BETWEEN ? AND ?`,
        [locationId, startDate, endDate]
      );

      // Query OpenMeteo API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${latitude}&longitude=${longitude}&` +
        `daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,surface_pressure_max&` +
        `timezone=auto&start_date=${startDate}&end_date=${endDate}`
      );

      const data = await response.json();

      // Insert new weather records
      for (let i = 0; i < data.daily.time.length; i++) {
        const date = data.daily.time[i];
        
        // Skip if we already have this date
        if (existingDates.some(ed => ed.date === date)) continue;

        await db.execute(
          `INSERT INTO Weather (
            date, type, temperature_high, temperature_low,
            surface_pressure, precipitation, wind_speed, user_location_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            date,
            "API", // type
            data.daily.temperature_2m_max[i],
            data.daily.temperature_2m_min[i],
            data.daily.surface_pressure_max[i],
            data.daily.precipitation_sum[i],
            data.daily.windspeed_10m_max[i],
            locationId
          ]
        );
      }
    },
    onSuccess: (_, { locationId, startDate, endDate }) => {
      queryClient.invalidateQueries({ 
        queryKey: queryKeys.weather(locationId, startDate, endDate)
      });
    }
  });
};
