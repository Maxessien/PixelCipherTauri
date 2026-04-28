use image::{image_dimensions, save_buffer_with_format, ExtendedColorType, ImageFormat};
use std::path::PathBuf;
use tauri_plugin_dialog::DialogExt;

use crate::engine;

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
    app.dialog().file().pick_folder(move |f| {
        let file_path = match f {
            Some(p) => match p.into_path() {
                Ok(fp) => fp,
                Err(_) => return ()
            },
            None => return ()
        };
        match save_buffer_with_format(
            file_path,
            &img_buf[..],
            width,
            height,
            ExtendedColorType::Rgb8,
            ImageFormat::Png,
        ) {
            Ok(_) => return (),
            Err(_) => return ()
        };
    });
    Ok(())
}


// #[serde()]

#[tauri::command]
async fn list_images(app: tauri::AppHandle) -> Result<(), String> {
  Ok(())
}