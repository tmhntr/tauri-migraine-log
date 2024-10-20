import Database from '@tauri-apps/plugin-sql';
// when using `"withGlobalTauri": true`, you may use
// const V = window.__TAURI__.sql;
import { EntryType, CreateEntrySchema } from './schema';

// const getDB = async () => await Database.load('sqlite:database.sqlite')

export const getEntries = async () => {
    const db = await Database.load('sqlite:database.sqlite');
    const entries = await db.select('SELECT * FROM entries') as EntryType[];
    return entries;
}

export const getEntry = async (id: number) => {
    const db = await Database.load('sqlite:database.sqlite');
    const entry = await db.select('SELECT * FROM entries WHERE id = $1', [id]) as EntryType[];
    return entry[0];
}

export const addEntry = async (entry?: CreateEntrySchema) => {
    const db = await Database.load('sqlite:database.sqlite');
    if (!entry) {
        const result = await db.execute('INSERT INTO entries DEFAULT VALUES RETURNING *', []);
        return result.lastInsertId;
    }
    const keys = Object.keys(entry) as Array<keyof CreateEntrySchema>;
    const query = `INSERT INTO entries (${keys.join(', ')}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
    const result = await db.execute(query, keys.map(key => entry[key]));
    return result.lastInsertId;
}

export const deleteEntry = async (id: number) => {
    const db = await Database.load('sqlite:database.sqlite');
    await db.execute('DELETE FROM entries WHERE id = $1', [id]);
}

export const updateEntry = async (id: number, entry: Partial<EntryType>) => {
    const db = await Database.load('sqlite:database.sqlite');
    const keys = Object.keys(entry);
    const query = `UPDATE entries SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(', ')} WHERE id = $${keys.length + 1}`;
    await db.execute(query, [...keys.map(key => entry[key as keyof EntryType]), id]);
}

export const getMonthlyEpisodeCount = async () => {
    const db = await Database.load('sqlite:database.sqlite');
    const query = `
        SELECT COUNT(*) as count
        FROM entries
        WHERE episode_date >= date('now', '-30 days')
        AND episode_date <= date('now')
    `;
    const result = await db.select<{count: number}[]>(query);
    return result[0].count as number;
}

export const getPreviousMonthlyEpisodeCount = async () => {
    const db = await Database.load('sqlite:database.sqlite');
    const query = `
        SELECT COUNT(*) as count
        FROM entries
        WHERE episode_date >= date('now', '-60 days')
        AND episode_date < date('now', '-30 days')
    `;
    const result = await db.select<{count: number}[]>(query);
    return result[0].count as number;
}

