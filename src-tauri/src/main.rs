// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod db;
use sqlx::sqlite::SqliteConnectOptions;
use std::str::FromStr;

#[tauri::command]
fn get_env(key: &str) -> String {
    std::env::var(String::from(key)).unwrap_or(String::from(""))
}

#[tauri::command]
fn get_db_url() -> String {
    "sqlite:database.sqlite".to_string()
}

fn main() {
    // db::init();

    tauri::Builder::default()
        .plugin(
            tauri_plugin_sql::Builder::default()
                .add_migrations(&get_db_url(), db::get_migrations())
                .add_sqlite_options(
                    &get_db_url(),
                    SqliteConnectOptions::from_str(&get_db_url()).expect("REASON").pragma("key", "password"),
                )
                .build(),
        )
        .invoke_handler(tauri::generate_handler![get_db_url])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
