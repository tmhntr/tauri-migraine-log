import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   getPainSites,
//   getSymptoms,
//   getWarnings,
//   getManagementSteps,
//   getManagementStepsForEntry,
//   getEntries,
//   getEntryById,
//   createEntry,
//   deleteEntry,
//   updateEntry,
//   createWeather,
//   createManagementStep,
//   getEpisodeCount,
//   getUserLocation,
//   createUserLocation,
//   getWeatherData,
//   syncWeatherData,
//   getUser,
//   getUsers,
//   createUser,
//   updateUser,
// } from "./db";
import {
  CreateEntry,
  CreateWeather,
  EntryData,
  PainSite,
  Symptom,
  Warning,
  ManagementStep,
  CreateManagementStep,
  User,
} from "../schema";


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
  weather: (startDate: string, endDate: string) =>
    ["weather", startDate, endDate] as const,
  currentWeather: (locationId: number) =>
    ["currentWeather", locationId] as const,
  managementSteps: ["managementSteps"] as const,
  managementStepsForEntry: (entryId: number) =>
    ["managementSteps", entryId] as const,
};



const getPainSites = () => {
  const doc
}

// Reference data queries
export const usePainSites = () => {
  return useQuery({
    queryKey: queryKeys.painSites,
    queryFn: getPainSites,
  });
};

export const useSymptoms = () => {
  return useQuery({
    queryKey: queryKeys.symptoms,
    queryFn: getSymptoms,
  });
};

export const useWarnings = () => {
  return useQuery({
    queryKey: queryKeys.warnings,
    queryFn: getWarnings,
  });
};

export const useManagementSteps = () => {
  return useQuery({
    queryKey: queryKeys.managementSteps,
    queryFn: getManagementSteps,
  });
};

export const useManagementStepsForEntry = (entryId: number) => {
  return useQuery({
    queryKey: queryKeys.managementStepsForEntry(entryId),
    queryFn: () => getManagementStepsForEntry(entryId),
  });
};

type EntryArrayData = {
  pain_sites: PainSite[];
  symptoms: Symptom[];
  warnings: Warning[];
  management_steps: ManagementStep[];
};

const addEntryArrayData = async (entry: EntryData): Promise<EntryArrayData> => {
  const painSites = await getManagementStepsForEntry(entry.id);
  const symptoms = await getManagementStepsForEntry(entry.id);
  const warnings = await getManagementStepsForEntry(entry.id);
  const managementSteps = await getManagementStepsForEntry(entry.id);

  return {
    pain_sites: painSites,
    symptoms: symptoms,
    warnings: warnings,
    management_steps: managementSteps,
  };
};

// Get Entry
export const useGetEntry = (id: number) => {
  return useQuery({
    queryKey: queryKeys.entry(id),
    queryFn: async () => {
      const entry = await getEntryById(id);
      return { ...entry, ...(await addEntryArrayData(entry)) } as EntryData;
    },
  });
};

// List entries
export const useListEntries = () => {
  return useQuery({
    queryKey: queryKeys.entries,
    queryFn: async () => {
      const entries = await getEntries();

      for (const entry of entries) {
        // Get related data
        const arrayData = await addEntryArrayData(entry);
        entry.pain_sites = arrayData.pain_sites;
        entry.symptoms = arrayData.symptoms;
        entry.warnings = arrayData.warnings;
        entry.management_steps = arrayData.management_steps;
      }

      return entries;
    },
  });
};

export const useCreateWeather = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createWeather,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

export const useCreateManagementStep = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createManagementStep,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.managementSteps });
    },
  });
};

// Entry mutations
export const useCreateEntry = () => {
  const queryClient = useQueryClient();
  const createWeatherMutation = useCreateWeather();
  const createManagementStepMutation = useCreateManagementStep();

  return useMutation({
    mutationFn: async (entry: CreateEntry) => {
      const weatherId = entry.weather
        ? await createWeatherMutation.mutateAsync(entry.weather)
        : null;

      // Create management steps
      const managementStepIds = await Promise.all(
        entry.management_steps.map((step) =>
          createManagementStepMutation.mutateAsync(step),
        ),
      );

      // Create entry
      return createEntry(entry, weatherId, managementStepIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

export const useDeleteEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEntry,
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
      return updateEntry(id, entry, painSiteIds, symptomIds, warningIds, managementStepIds);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.entries });
    },
  });
};

export const useGetEpisodeCount = (start_date: Date, end_date: Date) => {
  return useQuery({
    queryKey: ["episodeCount", start_date, end_date],
    queryFn: () => getEpisodeCount(start_date, end_date),
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
    queryFn: () => getUserLocation(userId),
  });
};

export const useWeatherData = (
  locationId: number,
  startDate: string,
  endDate: string,
) => {
  return useQuery({
    queryKey: queryKeys.weather(locationId, startDate, endDate),
    queryFn: () => getWeatherData(locationId, startDate, endDate),
  });
};

export const useUpdateUserLocation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      latitude,
      longitude,
      timezone,
    }: {
      userId: number;
      latitude: number;
      longitude: number;
      timezone: string;
    }) => {
      return createUserLocation(userId, latitude, longitude, timezone);
    },
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.userLocation(userId),
      });
    },
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
      endDate,
    }: {
      locationId: number;
      latitude: number;
      longitude: number;
      startDate: string;
      endDate: string;
    }) => {
      return syncWeatherData(locationId, latitude, longitude, startDate, endDate);
    },
    onSuccess: (_, { locationId, startDate, endDate }) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.weather(locationId, startDate, endDate),
      });
    },
  });
};

export const useListUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });
};

export const useGetUser = (id: number) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: () => getUser(id),
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, name }: { userId: number; name: string }) => {
      return updateUser(userId, name);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
