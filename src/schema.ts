import { z } from "zod";

// Symptom Schema
const symptomsSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
});
export type Symptom = z.infer<typeof symptomsSchema>;

// Pain Site Schema
const painSiteSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
});
export type PainSite = z.infer<typeof painSiteSchema>;

// Warning Schema
const warningSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
});
export const createWarningSchema = warningSchema.omit({ id: true });
export type Warning = z.infer<typeof warningSchema>;
export type CreateWarning = z.infer<typeof createWarningSchema>;

// Weather Schema
const weatherSchema = z.object({
  id: z.number().int().positive(),
  type: z.string().min(1, "Type cannot be empty"),
  temperature_high: z.number().min(-100).max(150).nullable(),
  temperature_low: z.number().min(-100).max(150).nullable(),
});
export const createWeatherSchema = weatherSchema.omit({ id: true });
export type Weather = z.infer<typeof weatherSchema>;
export type CreateWeather = z.infer<typeof createWeatherSchema>;

// Management Step Schema
const managementStepSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
  time: z.string().datetime(),
  amount: z.number().positive(),
  unit: z.string().min(1, "Unit cannot be empty"),
  notes: z.string().nullable(),
});
export const createManagementStepSchema = managementStepSchema.omit({ id: true });
export type ManagementStep = z.infer<typeof managementStepSchema>;
export type CreateManagementStep = z.infer<typeof createManagementStepSchema>;

// Entry Schema
const entrySchema = z.object({
  id: z.number().int().positive(),
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
  created_at: z.string(),
  updated_at: z.string(),
  symptoms: z.array(symptomsSchema),
  pain_sites: z.array(painSiteSchema),
  warnings: z.array(warningSchema),
  management_steps: z.array(managementStepSchema),
  weather: weatherSchema.nullable(),
});
export const createEntrySchema = entrySchema
  .omit({ id: true, updated_at: true, created_at: true })
  .extend({ weather: createWeatherSchema.nullable(), management_steps: z.array(createManagementStepSchema) });
export type EntryData = z.infer<typeof entrySchema>;
export type CreateEntry = z.infer<typeof createEntrySchema>;

managementStepSchema.extend({ entries: z.array(entrySchema).optional() });

// User Schema
const userSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
});
export const createUserSchema = userSchema.omit({ id: true });
export type User = z.infer<typeof userSchema>;
export type CreateUser = z.infer<typeof createUserSchema>;

// Location Schema
const locationSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1, "Name cannot be empty"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  timezone: z.string().min(1, "Timezone cannot be empty"),
});
export const createLocationSchema = locationSchema.omit({ id: true });
export type Location = z.infer<typeof locationSchema>;
export type CreateLocation = z.infer<typeof createLocationSchema>;
