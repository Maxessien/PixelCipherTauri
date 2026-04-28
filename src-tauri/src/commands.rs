use image::{image_dimensions, save_buffer_with_format, ExtendedColorType, ImageFormat};
use jwalk::WalkDir;
use serde::Serialize;
use std::{os::windows::fs::MetadataExt, path::PathBuf};
use tauri::Manager;
use tauri_plugin_dialog::DialogExt;
use crate::engine;
use tokio::sync::oneshot;


#[tauri::command]
pub async fn encode_image(
    app: tauri::AppHandle,
    path: PathBuf,
    message: String,
) -> Result<(), String> {
    let img_buf = engine::encode(&path, message)?;
    let (width, height) = match image_dimensions(&path) {
        Ok(dim) => dim,
        Err(_) => return Err("Failed to get image dimensions".to_string()),
    };
    let (tx, rx) = oneshot::channel();
    app.dialog().file().pick_file(move |f| {
        let result = match f {
            Some(p) => match p.into_path() {
                Ok(file_path) => {
                    match save_buffer_with_format(
                        file_path,
                        &img_buf[..],
                        width,
                        height,
                        ExtendedColorType::Rgb8,
                        ImageFormat::Png,
                    ) {
                        Ok(_) => Ok(()),
                        Err(_) => Err("Failed to save image format to disk".to_string()),
                    }
                },
                Err(_) => Err("Invalid file path selected".to_string()),
            },
            None => Err("User cancelled file selection".to_string()),
        };

        let _ = tx.send(result);
    });
    match rx.await {
        Ok(dialog_result) => dialog_result,
        Err(_) => Err("Internal channel error waiting for dialog".to_string()),
    }
}

pub const IMAGE_EXTS: &[&str] = &["jpg", "jpeg", "png", "gif", "webp"];

#[cfg(target_os = "android")]
fn get_dirs(_app: &tauri::AppHandle) -> [PathBuf; 2] {
    let dirs = [
        PathBuf::from("/storage/emulated/0/Download"),
        PathBuf::from("/storage/emulated/0/Pictures"),
    ];
    dirs
}

#[cfg(not(target_os = "android"))]
fn get_dirs(app: &tauri::AppHandle) -> [PathBuf; 2] {
    let path = app.path();
    let home = path.home_dir().unwrap_or_else(|_| PathBuf::from("."));
    [
        path.download_dir()
            .unwrap_or_else(|_| home.join("Downloads")),
        path.picture_dir().unwrap_or_else(|_| home.join("Pictures")),
    ]
}

#[derive(Serialize)]
pub struct Images {
    pub file_name: String,
    pub file_path: PathBuf,
    pub file_size: u64,
}

fn walkdir(path: PathBuf) -> Result<Vec<Images>, std::io::Error> {
    let mut images: Vec<Images> = Vec::new();
    let entries = WalkDir::new(path).sort(true).into_iter();
    for entryres in entries {
        let entry = match entryres {
            Ok(e) => e,
            Err(_) => continue,
        };
        if let Some(str) = entry.path().extension() {
            if let Some(inn_str) = str.to_str() {
                let lower = inn_str.to_ascii_lowercase();
                if IMAGE_EXTS.contains(&lower.as_str()) {
                    let image = Images {
                        file_name: entry.file_name.to_string_lossy().into_owned(),
                        file_path: entry.path(),
                        file_size: entry.metadata()?.file_size()
                    };
                    images.push(image);
                };
            };
        };
    }
    Ok(images)
}

#[tauri::command]
pub async fn list_images(app: tauri::AppHandle) -> Result<Vec<Images>, String> {
    let mut images: Vec<Images> = Vec::new();
    let dirs = get_dirs(&app);

    for dir in dirs {
        if let Ok(image) = walkdir(dir) {
            images.extend(image);
        };
    }
    Ok(images)
}
