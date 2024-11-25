import { date, z } from "zod";

// Symptom Schema
const symptomsSchema = z.string().min(1, "Name cannot be empty");

// Pain Site Schema
const painSiteSchema = z.string().min(1, "Name cannot be empty");

// Warning Schema
const warningSchema = z.string().min(1, "Warning cannot be empty");
export const createWarningSchema = warningSchema;

// Weather Schema
const weatherSchema = z.object({
  // id: z.number().int().positive(),
  type: z.string().min(1, "Type cannot be empty"),
  temperature_high: z.number().min(-100).max(150).nullable(),
  temperature_low: z.number().min(-100).max(150).nullable(),
  surface_pressure: z.number().min(0).nullable(),
  precipitation: z.number().min(0).nullable(),
  wind_speed: z.number().min(0).nullable(),
  date: z.string().date(),
  user_location_id: z.string().uuid(),
});
export const createWeatherSchema = weatherSchema;

// Management Step Schema
const managementStepSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name cannot be empty"),
  time: z.string().datetime(),
  amount: z.number().positive(),
  unit: z.string().min(1, "Unit cannot be empty"),
  notes: z.string().nullable(),
});
export const createManagementStepSchema = managementStepSchema

// Entry Schema
const entrySchema = z.object({
  id: z.string().uuid(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().nullable(),
  notes: z.string().nullable(),
  recent_duration_of_sleep: z
    .number()
    .gte(0, "Must be greater than 0")
    .nullable(),
  headache_severity: z
    .enum(["Mild", "Moderate", "Severe", "Extreme"])
    .nullable(),
  hydration_oz: z.number().positive().nullable(),
  warning_other: z.string().nullable(),
  symptoms: z.array(symptomsSchema),
  pain_sites: z.array(painSiteSchema),
  warnings: z.array(warningSchema),
  management_steps: z.array(managementStepSchema),
  weather: weatherSchema.nullable(),
});
export const createEntrySchema = entrySchema
  .extend({
    weather: createWeatherSchema.nullable(),
    management_steps: z.array(createManagementStepSchema),
  });

managementStepSchema.extend({ entries: z.array(entrySchema).optional() });
// Location Schema
const locationSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name cannot be empty"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, "Timezone cannot be empty"),
});

// User Schema
const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
  location: locationSchema.nullable(),
});
export const createUserSchema = userSchema;



export const createLocationSchema = locationSchema;

export type Symptom = z.infer<typeof symptomsSchema>;
export type PainSite = z.infer<typeof painSiteSchema>;
export type Warning = z.infer<typeof warningSchema>;
export type CreateWarning = z.infer<typeof createWarningSchema>;
export type Weather = z.infer<typeof weatherSchema>;
export type CreateWeather = z.infer<typeof createWeatherSchema>;
export type ManagementStep = z.infer<typeof managementStepSchema>;
export type CreateManagementStep = z.infer<typeof createManagementStepSchema>;
export type EntryData = z.infer<typeof entrySchema>;
export type CreateEntry = z.infer<typeof createEntrySchema>;
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;
export type Location = z.infer<typeof locationSchema>;
export type CreateLocation = z.infer<typeof createLocationSchema>;

export interface SharedState {
  entries: EntryData[];
  symptoms: Symptom[];
  painSites: PainSite[];
  warnings: Warning[];
  managementSteps: ManagementStep[];
  weather: Weather[];
  users: User[];
  locations: Location[];
}

