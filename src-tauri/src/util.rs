use jwalk::WalkDir;
use serde::{Deserialize, Serialize};
use std::{io::Error, path::PathBuf, time::SystemTime};
use tauri::Manager;
use tokio::fs::{create_dir_all, File};
use tokio::sync::oneshot::Sender;
use image::{save_buffer_with_format, ExtendedColorType, ImageFormat};

pub const IMAGE_EXTS: &[&str] = &["jpg", "jpeg", "png", "gif", "webp"];

#[derive(Deserialize)]
#[serde(rename_all="lowercase")]
pub enum Format {
    Jpg, Png, Webp
}

fn get_format(format: Format)-> (ImageFormat, String) {
    match format {
        Format::Jpg => (ImageFormat::Jpeg, "jpg".to_string()),
        Format::Png => (ImageFormat::Png, "png".to_string()),
        Format::Webp => (ImageFormat::WebP, "webp".to_string())
    }
}

#[cfg(not(target_os = "android"))]
pub fn save_image(
    save_name: String,
    image_buf: Vec<u8>,
    sender: Sender<Result<String, String>>,
    width: u32,
    height: u32,
    app: &tauri::AppHandle,
    img_format: Format
) {
    use tauri_plugin_dialog::{DialogExt, PickerMode};

    app.dialog()
        .file()
        .add_filter("Image File", &["png"])
        .set_file_name(save_name)
        .set_picker_mode(PickerMode::Image)
        .save_file(move |f| {
            let (format, ext) = get_format(img_format);
            let result = match f {
                Some(p) => match p.into_path() {
                    Ok(mut file_path) => {
                        file_path.set_extension(ext);
                        match save_buffer_with_format(
                            file_path,
                            &image_buf[..],
                            width,
                            height,
                            ExtendedColorType::Rgb8,
                            format,
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
    img_format: Format,
) {
    let pictures_path = PathBuf::from("/storage/emulated/0/Pictures");
    let mut save_path = pictures_path.join(save_name);
    let (format, ext) = get_format(img_format);
    save_path.set_extension(ext);
    let result = match save_buffer_with_format(
        save_path,
        &image_buf[..],
        width,
        height,
        ExtendedColorType::Rgb8,
        format,
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
