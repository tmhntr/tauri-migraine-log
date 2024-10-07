import Database from '@tauri-apps/plugin-sql';
// when using `"withGlobalTauri": true`, you may use
// const V = window.__TAURI__.sql;
import { Entry, CreateEntrySchema } from './components/data-table/data/schema';
export const getEntries = async () => {
    const db = await Database.load('sqlite:database.sqlite');
    const entries = await db.select('SELECT * FROM entries') as Entry[];
    return entries;
}

export const getEntry = async (id: number) => {
    const db = await Database.load('sqlite:database.sqlite');
    const entry = await db.select('SELECT * FROM entries WHERE id = $1', [id]) as Entry[];
    return entry[0];
}

export const addEntry = async (entry?: CreateEntrySchema) => {
    const db = await Database.load('sqlite:database.sqlite');
    if (!entry) {
        const result = await db.execute('INSERT INTO entries DEFAULT VALUES RETURNING *', []);
        return result.lastInsertId;
    }
    const keys = Object.keys(entry);
    const query = `INSERT INTO entries (${keys.join(', ')}) VALUES (${keys.map((_, index) => `$${index + 1}`).join(', ')}) RETURNING *`;
    const result = await db.execute(query, keys.map(key => entry[key as keyof Entry]));
    return result.lastInsertId;
}

export const deleteEntry = async (id: number) => {
    const db = await Database.load('sqlite:database.sqlite');
    await db.execute('DELETE FROM entries WHERE id = $1', [id]);
}

export const updateEntry = async (id: number, entry: Partial<Entry>) => {
    const db = await Database.load('sqlite:database.sqlite');
    const keys = Object.keys(entry);
    const query = `UPDATE entries SET ${keys.map((key, index) => `${key} = $${index + 1}`).join(', ')} WHERE id = $${keys.length + 1}`;
    await db.execute(query, [...keys.map(key => entry[key as keyof Entry]), id]);
}