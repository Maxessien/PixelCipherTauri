use jwalk::WalkDir;
use serde::Serialize;
use std::{io::Error, path::PathBuf, time::SystemTime};
use tauri::Manager;
use tokio::fs::{create_dir_all, File};
#[cfg(not(target_os = "android"))]
use tokio::sync::oneshot::Sender;
use image::{save_buffer_with_format, ExtendedColorType, ImageFormat};

pub const IMAGE_EXTS: &[&str] = &["jpg", "jpeg", "png", "gif", "webp"];

#[cfg(not(target_os = "android"))]
pub fn save_image(
    save_name: String,
    image_buf: Vec<u8>,
    sender: Sender<Result<String, String>>,
    width: u32,
    height: u32,
    app: &tauri::AppHandle,
) {
    use tauri_plugin_dialog::{DialogExt, PickerMode};

    app.dialog()
        .file()
        .add_filter("Image File", IMAGE_EXTS)
        .set_file_name(save_name)
        .set_picker_mode(PickerMode::Image)
        .save_file(move |f| {
            let result = match f {
                Some(p) => match p.into_path() {
                    Ok(file_path) => {

                        match save_buffer_with_format(
                            file_path,
                            &image_buf[..],
                            width,
                            height,
                            ExtendedColorType::Rgb8,
                            ImageFormat::Png,
                        ) {
                            Ok(_) => Ok("File saved".to_string()),
                            Err(_) => Err("Failed to save image format to disk".to_string()),
                        }
                    }
                    Err(_) => Err("Invalid file path selected".to_string()),
                },
                None => Err("User cancelled file selection".to_string()),
            };

            let _ = sender.send(result);
        });
    ()
}

#[cfg(target_os = "android")]
pub fn save_image(
    save_name: String,
    image_buf: Vec<u8>,
    sender: Sender<Result<String, String>>,
    width: u32,
    height: u32,
    _app: &tauri::AppHandle,
) {
    let pictures_path = PathBuf::from("/storage/emulated/0/Pictures");
    let result = match save_buffer_with_format(
        pictures_path.join(save_name),
        &image_buf[..],
        width,
        height,
        ExtendedColorType::Rgb8,
        ImageFormat::Png,
    ) {
        Ok(_) => Ok("File saved".to_string()),
        Err(_) => Err("Failed to save image format to disk".to_string()),
    };
    let _ = sender.send(result);
    ()
}

#[cfg(target_os = "android")]
pub fn get_dirs(_app: &tauri::AppHandle) -> [PathBuf; 2] {
    let dirs = [
        PathBuf::from("/storage/emulated/0/Download"),
        PathBuf::from("/storage/emulated/0/Pictures"),
    ];
    dirs
}

#[cfg(not(target_os = "android"))]
pub fn get_dirs(app: &tauri::AppHandle) -> [PathBuf; 2] {
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
    pub last_modified: SystemTime,
}

pub fn walkdir(path: PathBuf) -> Result<Vec<Images>, Error> {
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
                        file_size: entry.metadata()?.len(),
                        last_modified: entry.metadata()?.modified()?,
                    };
                    images.push(image);
                };
            };
        };
    }
    Ok(images)
}

pub async fn get_settings_path(app: &tauri::AppHandle) -> Result<(PathBuf, bool), String> {
    let mut was_created = false;
    let path = match app.path().app_data_dir() {
        Ok(p) => p,
        Err(_) => return Err("Couldn't resolve app data dir".to_string()),
    };
    let settings_path = path.join("settings.json");
    if !settings_path.exists() {
        match create_dir_all(&path).await {
            Ok(_) => {}
            Err(_) => return Err("Couldn't create settings path".to_string()),
        };
        let _ = File::create_new(&settings_path).await;
        was_created = true;
    }
    Ok((settings_path, was_created))
}
