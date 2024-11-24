use tauri_plugin_sql::{Migration, MigrationKind};

pub fn get_migrations() -> Vec<Migration> {
    vec![
        // Migration {
        //     version: 1,
        //     description: "add_password",
        //     sql: "
        //         PRAGMA key = 'secretkey';
        //         ",
        //     kind: MigrationKind::Up,
        // },
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
                    temperature_low INTEGER DEFAULT NULL,
                    date DATE,
                    surface_pressure REAL,
                    precipitation REAL,
                    wind_speed REAL,
                    user_location_id INTEGER,
                    
                    FOREIGN KEY (user_location_id) REFERENCES UserLocation(id) ON DELETE CASCADE
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

                -- Add ManagementStep table
                CREATE TABLE IF NOT EXISTS ManagementStep (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    time TEXT DEFAULT NULL,
                    amount REAL DEFAULT NULL,
                    amount_unit TEXT DEFAULT NULL,
                    notes TEXT DEFAULT NULL
                );

                -- Add ManagementStepEntry join table
                CREATE TABLE IF NOT EXISTS ManagementStepEntry (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    entry_id INTEGER NOT NULL,
                    management_step_id INTEGER NOT NULL,
                    
                    FOREIGN KEY (entry_id) REFERENCES Entry(id) ON DELETE CASCADE,
                    FOREIGN KEY (management_step_id) REFERENCES ManagementStep(id) ON DELETE CASCADE
                );

                -- Create User table
                CREATE TABLE IF NOT EXISTS User (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                );

                CREATE TRIGGER IF NOT EXISTS update_User_updated_at
                AFTER UPDATE ON User
                FOR EACH ROW
                BEGIN
                    UPDATE User SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;

                -- Create UserLocation table
                CREATE TABLE IF NOT EXISTS UserLocation (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    latitude REAL NOT NULL,
                    longitude REAL NOT NULL,
                    timezone TEXT NOT NULL,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    
                    FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
                );

                CREATE TRIGGER IF NOT EXISTS update_UserLocation_updated_at
                AFTER UPDATE ON UserLocation
                FOR EACH ROW
                BEGIN
                    UPDATE UserLocation SET updated_at = CURRENT_TIMESTAMP WHERE id = OLD.id;
                END;

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
