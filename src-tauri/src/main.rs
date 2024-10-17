// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri_plugin_sql::{Migration, MigrationKind};

mod db;

fn main() {
    db::init();
    let migrations = vec![
        // Define your migrations here
        Migration {
            version: 1,
            description: "create_initial_tables",
            sql: 
            "
            DROP TABLE IF EXISTS entries;
            CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                episode_date DATE DEFAULT NULL,
                estimated_onset_time TIME DEFAULT NULL,
                estimated_onset_period TEXT CHECK (estimated_onset_period IN ('AM', 'PM')) DEFAULT NULL,
                estimated_ended_time TIME DEFAULT NULL,
                estimated_ended_period TEXT CHECK (estimated_ended_period IN ('AM', 'PM')) DEFAULT NULL,
                recent_duration_of_sleep TEXT DEFAULT NULL,  -- There is no INTERVAL type in SQLite, so we'll store duration as text
                site_of_pain_front BOOLEAN DEFAULT NULL,
                site_of_pain_back BOOLEAN DEFAULT NULL,
                site_of_pain_left BOOLEAN DEFAULT NULL,
                site_of_pain_right BOOLEAN DEFAULT NULL,
                site_of_pain_top BOOLEAN DEFAULT NULL,
                headache_severity TEXT CHECK (headache_severity IN ('Mild', 'Moderate', 'Severe', 'Extreme')) DEFAULT NULL,
                weather TEXT DEFAULT NULL,
                temperature_high INTEGER DEFAULT NULL,
                temperature_low INTEGER DEFAULT NULL,
                hydration_oz INTEGER DEFAULT NULL,
                symptoms_throbbing BOOLEAN DEFAULT NULL,
                symptoms_burning BOOLEAN DEFAULT NULL,
                symptoms_dull_ache BOOLEAN DEFAULT NULL,
                symptoms_knife_like BOOLEAN DEFAULT NULL,
                symptoms_nausea BOOLEAN DEFAULT NULL,
                symptoms_light_sensitivity BOOLEAN DEFAULT NULL,
                symptoms_pressure BOOLEAN DEFAULT NULL,
                symptoms_aura BOOLEAN DEFAULT NULL,
                symptoms_tight_band BOOLEAN DEFAULT NULL,
                symptoms_neck_ache BOOLEAN DEFAULT NULL,
                warning_vision BOOLEAN DEFAULT NULL,
                warning_numbness BOOLEAN DEFAULT NULL,
                warning_aching_neck BOOLEAN DEFAULT NULL,
                warning_other TEXT DEFAULT NULL,
                factors_brought_on TEXT DEFAULT NULL,
                factors_relieve TEXT DEFAULT NULL,
                total_hours_of_migraine REAL DEFAULT NULL
            );",
            kind: MigrationKind::Up,
        }
    ];

    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .setup(|_app| {
            // Initialize the database.
            db::init();

            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::default().add_migrations(&("sqlite:".to_owned() + &db::get_db_path()), migrations).build())
        .plugin(tauri_plugin_shell::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
