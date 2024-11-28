// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// mod db;
// use sqlx::sqlite::SqliteConnectOptions;
// use std::str::FromStr;

#[tauri::command]
fn get_env(key: &str) -> String {
    std::env::var(String::from(key)).unwrap_or(String::from(""))
}

#[tauri::command]
fn get_local_ip() -> String {
    local_ip().unwrap().to_string()
}

use local_ip_address::local_ip;
// use std::net::IpAddr;


fn main() {
    // db::init();

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_local_ip])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
