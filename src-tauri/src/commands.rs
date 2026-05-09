use crate::{engine, util};
use crate::util::{get_dirs, get_settings_path, walkdir, Images};
use image::{image_dimensions};
use std::path::PathBuf;
use tokio::{
    fs::{write, File},
    io::AsyncReadExt,
    sync::oneshot,
};

#[tauri::command]
pub async fn encode_image(
    app: tauri::AppHandle,
    path: PathBuf,
    message: String,
    save_name: String,
    img_format: util::Format
) -> Result<String, String> {
    let image_buf = engine::encode(&path, message)?;
    let (width, height) = match image_dimensions(&path) {
        Ok(dim) => dim,
        Err(_) => return Err("Failed to get image dimensions".to_string()),
    };
    let (sender, rx) = oneshot::channel();
    util::save_image(save_name, image_buf, sender, width, height, &app, img_format);
    match rx.await {
        Ok(dialog_result) => dialog_result,
        Err(_) => Err("Internal channel error waiting for dialog".to_string()),
    }
}

#[tauri::command]
pub async fn decode_image(path: PathBuf) -> Result<String, String> {
    let message = engine::decode(path)?;
    Ok(message)
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

#[tauri::command]
pub async fn save_settings(app: tauri::AppHandle, settings: String) -> Result<(), String> {
    let settings_path = get_settings_path(&app).await?;

    match write(settings_path.0, settings.as_bytes()).await {
        Ok(_) => {}
        Err(_) => return Err("Couldn't write to settings file".to_string()),
    };
    Ok(())
}

#[tauri::command]
pub async fn get_settings(
    app: tauri::AppHandle,
    default_settings: String,
) -> Result<String, String> {
    let (settings_path, was_created) = get_settings_path(&app).await?;
    let mut settings = String::new();

    if was_created {
        match write(settings_path, default_settings.as_bytes()).await {
            Ok(_) => {
                settings = default_settings;
            }
            Err(_) => return Err("Couldn't write to settings file".to_string()),
        };
    } else {
        match File::open(settings_path).await {
            Ok(mut f) => {
                let _ = f.read_to_string(&mut settings).await;
            }
            Err(_) => return Err("Couldn't read settings file".to_string()),
        };
    };

    Ok(settings)
}
