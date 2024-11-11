// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};

// mod db;

fn main() {
    // db::init();
    let migrations = vec![
        Migration {
            version: 1,
            description: "create_normalized_tables",
            sql: "
                -- Create the main `Entry` table
                CREATE TABLE IF NOT EXISTS Entry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    start_time DATETIME,
                    end_time DATETIME DEFAULT NULL,
                    notes TEXT DEFAULT NULL,
                    recent_duration_of_sleep TEXT DEFAULT NULL,
                    headache_severity TEXT CHECK (headache_severity IN ('Mild', 'Moderate', 'Severe', 'Extreme')) DEFAULT NULL,
                    hydration_oz INTEGER DEFAULT NULL,
                    weather_id INTEGER DEFAULT NULL,
                    warning_other TEXT DEFAULT NULL,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (weather_id) REFERENCES Weather(id) ON DELETE SET NULL
                );

                -- Add the update trigger
                CREATE TRIGGER IF NOT EXISTS update_Entry_updatedAt
                AFTER UPDATE ON Entry
                FOR EACH ROW
                BEGIN
                    UPDATE Entry SET updatedAt = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;

                -- Create supporting tables
                CREATE TABLE IF NOT EXISTS PainSite (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );

                CREATE TABLE IF NOT EXISTS PainSiteEntry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entryId INTEGER NOT NULL,
                    painSiteId INTEGER NOT NULL,
                    
                    FOREIGN KEY (entryId) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (painSiteId) REFERENCES PainSite(id) ON DELETE CASCADE,
                    
                    UNIQUE (entryId, painSiteId)
                );

                CREATE TABLE IF NOT EXISTS Symptom (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );

                CREATE TABLE IF NOT EXISTS SymptomEntry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entryId INTEGER NOT NULL,
                    symptomId INTEGER NOT NULL,
                    
                    FOREIGN KEY (entryId) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (symptomId) REFERENCES Symptom(id) ON DELETE CASCADE,
                    
                    UNIQUE (entryId, symptomId)
                );

                CREATE TABLE IF NOT EXISTS Weather (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    type TEXT NOT NULL,
                    temperature_high INTEGER DEFAULT NULL,
                    temperature_low INTEGER DEFAULT NULL
                );

                -- Add Warning table
                CREATE TABLE IF NOT EXISTS Warning (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );

                -- Add WarningEntry join table
                CREATE TABLE IF NOT EXISTS WarningEntry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entryId INTEGER NOT NULL,
                    warningId INTEGER NOT NULL,
                    
                    FOREIGN KEY (entryId) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (warningId) REFERENCES Warning(id) ON DELETE CASCADE,
                    
                    UNIQUE (entryId, warningId)
                );

                -- Insert initial data
                INSERT INTO PainSite (name) VALUES 
                    ('Front'),
                    ('Back'),
                    ('Left'),
                    ('Right'),
                    ('Top');

                INSERT INTO Symptom (name) VALUES 
                    ('Throbbing'),
                    ('Burning'),
                    ('Dull Ache'),
                    ('Knife-like'),
                    ('Nausea'),
                    ('Light Sensitivity'),
                    ('Pressure'),
                    ('Aura'),
                    ('Tight Band'),
                    ('Neck Ache');

                -- Insert initial warning data
                INSERT INTO Warning (name) VALUES 
                    ('Vision Changes'),
                    ('Numbness'),
                    ('Aching Neck');
            ",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations("sqlite:database.sqlite", migrations)
                .build(),
        )
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
