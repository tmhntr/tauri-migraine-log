import Database from "@tauri-apps/plugin-sql";
import { invoke } from "@tauri-apps/api/core";
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
  Location as UserLocation,
  Weather as WeatherData,
} from "../schema";

const getDb = async () => {
  return await Database.load(await invoke<string>("get_db_url", {}));
};

// PainSite
export const getPainSites = async (): Promise<PainSite[]> => {
  const db = await getDb();
  return await db.select<PainSite[]>(queries.selectPainSites);
};

// Symptom
export const getSymptoms = async (): Promise<Symptom[]> => {
  const db = await getDb();
  return await db.select<Symptom[]>(queries.selectSymptoms);
};

// Warning
export const getWarnings = async (): Promise<Warning[]> => {
  const db = await getDb();
  return await db.select<Warning[]>(queries.selectWarnings);
};

// ManagementStep
export const getManagementSteps = async (): Promise<ManagementStep[]> => {
  const db = await getDb();
  return await db.select<ManagementStep[]>(queries.selectManagementSteps);
};

export const getManagementStepsForEntry = async (entryId: number): Promise<ManagementStep[]> => {
  const db = await getDb();
  return await db.select<ManagementStep[]>(queries.selectManagementStepsForEntry, [entryId]);
};

// Entry
export const getEntries = async (): Promise<EntryData[]> => {
  const db = await getDb();
  return await db.select<EntryData[]>(queries.selectEntries);
};

export const getEntryById = async (id: number): Promise<EntryData> => {
  const db = await getDb();
  const entries = await db.select<EntryData[]>(queries.selectEntryById, [id]);
  if (entries.length === 0) {
    throw new Error("Entry not found");
  }
  return entries[0];
};

export const createEntry = async (entry: CreateEntry, weatherId: number | null, managementStepIds: number[]): Promise<number> => {
  const db = await getDb();
  const result = await db.execute(queries.insertEntry, [
    entry.start_time,
    entry.end_time,
    entry.notes,
    entry.recent_duration_of_sleep,
    entry.headache_severity,
    entry.hydration_oz,
    weatherId,
    entry.warning_other,
  ]);
  const entryId = result.lastInsertId;

  for (const painSite of entry.pain_sites) {
    await db.execute(queries.insertPainSiteEntry, [entryId, painSite.id]);
  }

  for (const symptom of entry.symptoms) {
    await db.execute(queries.insertSymptomEntry, [entryId, symptom.id]);
  }

  for (const warning of entry.warnings) {
    await db.execute(queries.insertWarningEntry, [entryId, warning.id]);
  }

  for (const id of managementStepIds) {
    await db.execute(queries.insertManagementStepEntry, [entryId, id]);
  }

  return entryId;
};

export const deleteEntry = async (id: number): Promise<void> => {
  const db = await getDb();
  await db.execute(queries.deletePainSiteEntry, [id]);
  await db.execute(queries.deleteSymptomEntry, [id]);
  await db.execute(queries.deleteWarningEntry, [id]);
  await db.execute(queries.deleteManagementStepEntry, [id]);
  await db.execute(queries.deleteEntry, [id]);
};

export const updateEntry = async (id: number, entry: Partial<EntryData>, painSiteIds: number[], symptomIds: number[], warningIds: number[], managementStepIds: number[]): Promise<void> => {
  const db = await getDb();
  const keys = Object.keys(entry);
  const query = queries.updateEntry(keys);
  await db.execute(query, [
    ...keys.map((key) => entry[key as keyof EntryData]),
    id,
  ]);

  await db.execute(queries.deletePainSiteEntry, [id]);
  await db.execute(queries.deleteSymptomEntry, [id]);
  await db.execute(queries.deleteWarningEntry, [id]);
  await db.execute(queries.deleteManagementStepEntry, [id]);

  for (const painSiteId of painSiteIds) {
    await db.execute(queries.insertPainSiteEntry, [id, painSiteId]);
  }

  for (const symptomId of symptomIds) {
    await db.execute(queries.insertSymptomEntry, [id, symptomId]);
  }

  for (const warningId of warningIds) {
    await db.execute(queries.insertWarningEntry, [id, warningId]);
  }

  for (const managementStepId of managementStepIds) {
    await db.execute(queries.insertManagementStepEntry, [id, managementStepId]);
  }
};

// Weather
export const createWeather = async (weather: CreateWeather): Promise<number> => {
  const db = await getDb();
  const result = await db.execute(queries.insertWeather, [
    weather.type,
    weather.temperature_high,
    weather.temperature_low,
  ]);
  return result.lastInsertId;
};

// ManagementStep
export const createManagementStep = async (managementStep: CreateManagementStep): Promise<number> => {
  const db = await getDb();
  const result = await db.execute(queries.insertManagementStep, [
    managementStep.name,
    managementStep.time,
    managementStep.amount,
    managementStep.unit,
    managementStep.notes,
  ]);
  return result.lastInsertId;
};

// Episode Count
export const getEpisodeCount = async (start_date: Date, end_date: Date): Promise<number> => {
  const db = await getDb();
  const result = await db.select<[{ count: number }]>(queries.selectEpisodeCount, [
    start_date.toISOString(),
    end_date.toISOString(),
  ]);
  return result[0].count;
};

// UserLocation
export const getUserLocation = async (userId: number): Promise<UserLocation> => {
  const db = await getDb();
  const locations = await db.select<UserLocation[]>(queries.selectUserLocation, [userId]);
  return locations[0];
};

export const createUserLocation = async (userId: number, latitude: number, longitude: number, timezone: string): Promise<number> => {
  const db = await getDb();
  const result = await db.execute(queries.insertUserLocation, [
    userId,
    latitude,
    longitude,
    timezone,
  ]);
  return result.lastInsertId;
};

// Weather Data
export const getWeatherData = async (locationId: number, startDate: string, endDate: string): Promise<WeatherData[]> => {
  const db = await getDb();
  return await db.select<WeatherData[]>(queries.selectWeatherData, [
    locationId,
    startDate,
    endDate,
  ]);
};

export const syncWeatherData = async (locationId: number, latitude: number, longitude: number, startDate: string, endDate: string): Promise<void> => {
  const db = await getDb();
  const existingDates = await db.select<{ date: string }[]>(queries.selectExistingWeatherDates, [
    locationId,
    startDate,
    endDate,
  ]);

  const response = await fetch(
    `https://api.open-meteo.com/v1/forecast?` +
      `latitude=${latitude}&longitude=${longitude}&` +
      `daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max,surface_pressure_max&` +
      `timezone=auto&start_date=${startDate}&end_date=${endDate}`,
  );

  const data = await response.json();

  for (let i = 0; i < data.daily.time.length; i++) {
    const date = data.daily.time[i];

    if (existingDates.some((ed) => ed.date === date)) continue;

    await db.execute(queries.insertWeatherData, [
      date,
      "API",
      data.daily.temperature_2m_max[i],
      data.daily.temperature_2m_min[i],
      data.daily.surface_pressure_max[i],
      data.daily.precipitation_sum[i],
      data.daily.windspeed_10m_max[i],
      locationId,
    ]);
  }
};

// User
export const getUser = async (id: number): Promise<User> => {
  const db = await getDb();
  const users = await db.select<User[]>(queries.selectUserById, [id]);
  return users[0];
};

export const getUsers = async (): Promise<User[]> => {
  const db = await getDb();
  return await db.select<User[]>(queries.selectUsers);
};

export const createUser = async (name: string): Promise<number> => {
  const db = await getDb();
  const result = await db.execute(queries.insertUser, [name]);
  return result.lastInsertId;
};

export const updateUser = async (userId: number, name: string): Promise<void> => {
  const db = await getDb();
  await db.execute(queries.updateUser, [name, userId]);
};

// SQL Queries
export const queries = {
  selectPainSites: "SELECT * FROM PainSite",
  selectSymptoms: "SELECT * FROM Symptom",
  selectWarnings: "SELECT * FROM Warning",
  selectManagementSteps: "SELECT * FROM ManagementStep",
  selectManagementStepsForEntry: `SELECT ManagementStep.* FROM ManagementStep
                                   JOIN ManagementStepEntry ON ManagementStep.id = ManagementStepEntry.management_step_id
                                   WHERE ManagementStepEntry.entry_id = ?`,
  selectPainSitesForEntry: `SELECT PainSite.* FROM PainSite 
                            JOIN PainSiteEntry ON PainSite.id = PainSiteEntry.pain_site_id 
                            WHERE PainSiteEntry.entry_id = ?`,
  selectSymptomsForEntry: `SELECT Symptom.* FROM Symptom
                           JOIN SymptomEntry ON Symptom.id = SymptomEntry.symptom_id
                           WHERE SymptomEntry.entry_id = ?`,
  selectWarningsForEntry: `SELECT Warning.* FROM Warning
                           JOIN WarningEntry ON Warning.id = WarningEntry.warning_id
                           WHERE WarningEntry.entry_id = ?`,
  selectEntries: "SELECT * FROM Entry",
  selectEntryById: "SELECT * FROM Entry WHERE id = ?",
  insertWeather: "INSERT INTO Weather (type, temperature_high, temperature_low) VALUES (?, ?, ?)",
  insertManagementStep: "INSERT INTO ManagementStep (name, time, amount, amount_unit, notes) VALUES (?, ?, ?, ?, ?)",
  insertEntry: `INSERT INTO Entry (start_time, end_time, notes, recent_duration_of_sleep, headache_severity, hydration_oz, weather_id, warning_other) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  insertPainSiteEntry: "INSERT INTO PainSiteEntry (entry_id, pain_site_id) VALUES (?, ?)",
  insertSymptomEntry: "INSERT INTO SymptomEntry (entry_id, symptom_id) VALUES (?, ?)",
  insertWarningEntry: "INSERT INTO WarningEntry (entry_id, warning_id) VALUES (?, ?)",
  insertManagementStepEntry: "INSERT INTO ManagementStepEntry (entry_id, management_step_id) VALUES (?, ?)",
  deletePainSiteEntry: "DELETE FROM PainSiteEntry WHERE entry_id = ?",
  deleteSymptomEntry: "DELETE FROM SymptomEntry WHERE entry_id = ?",
  deleteWarningEntry: "DELETE FROM WarningEntry WHERE entry_id = ?",
  deleteManagementStepEntry: "DELETE FROM ManagementStepEntry WHERE entry_id = ?",
  deleteEntry: "DELETE FROM Entry WHERE id = ?",
  updateEntry: (keys: string[]) => `UPDATE Entry SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(", ")} WHERE id = $${keys.length + 1}`,
  selectEpisodeCount: `SELECT COUNT(start_time) as count 
                       FROM Entry 
                       WHERE start_time >= ? AND start_time <= ?`,
  selectUserLocation: "SELECT * FROM UserLocation WHERE user_id = ? ORDER BY created_at DESC LIMIT 1",
  selectWeatherData: `SELECT * FROM Weather 
                      WHERE user_location_id = ? 
                      AND date BETWEEN ? AND ?
                      ORDER BY date ASC`,
  insertUserLocation: `INSERT INTO UserLocation (user_id, latitude, longitude, timezone)
                       VALUES (?, ?, ?, ?)`,
  selectExistingWeatherDates: `SELECT date FROM Weather 
                               WHERE user_location_id = ? 
                               AND date BETWEEN ? AND ?`,
  insertWeatherData: `INSERT INTO Weather (
                        date, type, temperature_high, temperature_low,
                        surface_pressure, precipitation, wind_speed, user_location_id
                      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
  selectUserById: "SELECT * FROM User WHERE id = ?",
  selectUsers: "SELECT * FROM User",
  insertUser: "INSERT INTO User (name) VALUES (?)",
  updateUser: "UPDATE User SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
};
