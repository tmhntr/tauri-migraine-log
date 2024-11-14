import { z } from "zod"


const symptomsSchema = z.object({
  id: z.number(),
  name: z.string(), 
})
const painSiteSchema = z.object({
  id: z.number(),
  name: z.string(),
});
const warningSchema = z.object({
  id: z.number(),
  name: z.string(),
})
const createWarningSchema = warningSchema.omit({id: true})
const weatherSchema = z.object({
  id: z.number(),
  type: z.string(),
  temperature_high: z.number().nullable(),
  temperature_low: z.number().nullable()
})
const createWeatherSchema = weatherSchema.omit({id: true})

const entrySchema = z.object({
  id: z.number(),
  start_time: z.string().datetime(),
  end_time: z.string().datetime().nullable(),
  notes: z.string().nullable(),
  recent_duration_of_sleep: z.number().gte(0, "Must be greater than 0").nullable(),
  headache_severity: z.enum(['Mild', 'Moderate', 'Severe', 'Extreme']).nullable(),
  hydration_oz: z.number().nullable(),
  warning_other: z.string().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
  symptoms: z.array(symptomsSchema),
  pain_sites: z.array(painSiteSchema),
  warnings: z.array(warningSchema),
  weather: weatherSchema.nullable()
})
export const createEntrySchema = entrySchema.omit({id: true, updated_at: true, created_at: true}).extend({weather: createWeatherSchema.nullable()})


export type EntryData = z.infer<typeof entrySchema>
export type CreateEntry = z.infer<typeof createEntrySchema>
export type Weather = z.infer<typeof weatherSchema>
export type CreateWeather = z.infer<typeof createWeatherSchema>
export type PainSite = z.infer<typeof painSiteSchema>
export type Symptom = z.infer<typeof symptomsSchema>
export type Warning = z.infer<typeof warningSchema>
export type CreateWarning = z.infer<typeof createWarningSchema>
