use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
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
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,

                    FOREIGN KEY (weather_id) REFERENCES Weather(id) ON DELETE SET NULL
                );

                -- Add the update trigger
                CREATE TRIGGER IF NOT EXISTS update_Entry_updated_at
                AFTER UPDATE ON Entry
                FOR EACH ROW
                BEGIN
                    UPDATE Entry SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;

                -- Create supporting tables
                CREATE TABLE IF NOT EXISTS PainSite (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );

                CREATE TABLE IF NOT EXISTS PainSiteEntry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entry_id INTEGER NOT NULL,
                    pain_site_id INTEGER NOT NULL,
                    
                    FOREIGN KEY (entry_id) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (pain_site_id) REFERENCES PainSite(id) ON DELETE CASCADE,
                    
                    UNIQUE (entry_id, pain_site_id)
                );

                CREATE TABLE IF NOT EXISTS Symptom (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT UNIQUE NOT NULL
                );

                CREATE TABLE IF NOT EXISTS SymptomEntry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entry_id INTEGER NOT NULL,
                    symptom_id INTEGER NOT NULL,
                    
                    FOREIGN KEY (entry_id) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (symptom_id) REFERENCES Symptom(id) ON DELETE CASCADE,
                    
                    UNIQUE (entry_id, symptom_id)
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
                    entry_id INTEGER NOT NULL,
                    warning_id INTEGER NOT NULL,
                    
                    FOREIGN KEY (entry_id) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (warning_id) REFERENCES Warning(id) ON DELETE CASCADE,
                    
                    UNIQUE (entry_id, warning_id)
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
    ]
}
  