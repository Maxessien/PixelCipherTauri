use image::open;
use std::path::PathBuf;

fn get_image_bytes(path: &PathBuf) -> Result<Vec<u8>, String> {
    let file = match open(path) {
        Ok(f) => f,
        Err(_) => return Err("Failed to open image".to_string()),
    };
    Ok(file.to_rgb8().into_raw())
}

pub fn encode(image_path: &PathBuf, message: String) -> Result<Vec<u8>, String> {
    let mut img_bytes = get_image_bytes(image_path)?;
    let message_len_bytes = (message.len() as u32).to_be_bytes();
    let mut str_bytes = Vec::new();
    str_bytes.extend_from_slice("MAXSTEG".as_bytes());
    str_bytes.extend_from_slice(&message_len_bytes);
    str_bytes.extend_from_slice(&message.as_bytes());

    let total_bits_needed = str_bytes.len() * 8;

    if total_bits_needed > img_bytes.len() {
        return Err("Message too large for image".to_string());
    }

    for idx in 0..total_bits_needed {
        let curr_byte_idx = idx / 8;
        let offset = 7 - (idx % 8);
        let byte = (str_bytes[curr_byte_idx] >> offset) & 1;
        img_bytes[idx] = (img_bytes[idx] & 0xFE) | byte as u8
    }

    Ok(img_bytes)
}

fn get_lsb(bytes: Vec<u8>) -> Vec<u8> {
    let mut lsb = Vec::new();
    let mut current_byte: u8 = 0;
    for (idx, byte) in bytes.iter().enumerate() {
        let bit = byte & 1;
        current_byte = (current_byte << 1) | bit;
        if idx % 8 == 7 {
            lsb.push(current_byte);
            current_byte = 0
        };
    }
    lsb
}

fn convert_bytes_to_str(bytes: Vec<u8>) -> Result<String, String> {
    match String::from_utf8(bytes) {
        Ok(str) => Ok(str),
        Err(_) => Err("Failed to extract string".to_string()),
    }
}

pub fn decode(image_path: PathBuf) -> Result<String, String> {
    let img_bytes = get_image_bytes(&image_path)?;
    let magic_len = "MAXSTEG".to_string().as_bytes().len() * 8;
    let magic_lsb = get_lsb(img_bytes[..magic_len].to_vec());

    if convert_bytes_to_str(magic_lsb)? != "MAXSTEG".to_string() {
        return Err("Unrecognised encoding".to_string());
    };

    let message_length_lsb = get_lsb(img_bytes[magic_len..magic_len + 32].to_vec());
    let message_length = u32::from_be_bytes([
        message_length_lsb[0],
        message_length_lsb[1],
        message_length_lsb[2],
        message_length_lsb[3],
    ]);

    let required_len = magic_len + 32 + ((message_length * 8) as usize);
    if required_len > img_bytes.len() {
        return Err("Message length exceeds image capacity".to_string());
    }
    let message_lsb =
        get_lsb(img_bytes[magic_len + 32..magic_len + 32 + (message_length * 8) as usize].to_vec());

    Ok(convert_bytes_to_str(message_lsb)?)
}
