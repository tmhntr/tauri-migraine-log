import { z } from "zod"

// We're keeping a simple non-relational schema here.
// IRL, you will have a schema for your data models.
export const entrySchema = z.object({
  id: z.number(),
  total_hours_of_migraine: z.number().nullable(),
  episode_date: z.string().nullable(),
  estimated_onset_time: z.string().nullable(),
  estimated_onset_period: z.enum(['AM', 'PM']).nullable(),
  estimated_ended_time: z.string().nullable(),
  estimated_ended_period: z.enum(['AM', 'PM']).nullable(),
  recent_duration_of_sleep: z.string().nullable(),
  site_of_pain_front: z.boolean().nullable(),
  site_of_pain_back: z.boolean().nullable(),
  site_of_pain_left: z.boolean().nullable(),
  site_of_pain_right: z.boolean().nullable(),
  site_of_pain_top: z.boolean().nullable(),
  headache_severity: z.enum(['Mild', 'Moderate', 'Severe', 'Extreme']).nullable(),
  weather: z.string().nullable(),
  temperature_high: z.number().nullable(),
  temperature_low: z.number().nullable(),
  hydration_oz: z.number().nullable(),
  symptoms_throbbing: z.boolean().nullable(),
  symptoms_burning: z.boolean().nullable(),
  symptoms_dull_ache: z.boolean().nullable(),
  symptoms_knife_like: z.boolean().nullable(),
  symptoms_nausea: z.boolean().nullable(),
  symptoms_light_sensitivity: z.boolean().nullable(),
  symptoms_pressure: z.boolean().nullable(),
  symptoms_aura: z.boolean().nullable(),
  symptoms_tight_band: z.boolean().nullable(),
  symptoms_neck_ache: z.boolean().nullable(),
  warning_vision: z.boolean().nullable(),
  warning_numbness: z.boolean().nullable(),
  warning_aching_neck: z.boolean().nullable(),
  warning_other: z.string().nullable(),
  factors_brought_on: z.string().nullable(),
  factors_relieve: z.string().nullable(),
})

export type EntryType = z.infer<typeof entrySchema>

export type CreateEntrySchema = Partial<Entry>
