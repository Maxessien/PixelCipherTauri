use image::open;
use std::path::PathBuf;

fn get_image_bytes(path: &PathBuf) -> Result<Vec<u8>, String> {
    let file = match open(path) {
        Ok(f) => f,
        Err(_) => return Err("Failed to open image".to_string()),
    };
    Ok(file.to_rgb8().into_raw())
}

fn convert_str_to_bytes(str: String) -> String {
    let mut full_str = String::new();
    for byte in str.as_bytes() {
        full_str += &format!("{:08b}", byte);
    }
    full_str
}
pub fn encode(image_path: &PathBuf, message: String) -> Result<Vec<u8>, String> {
    let mut img_bytes = get_image_bytes(image_path)?;
    let message_len_bytes = format!("{:032b}", message.len());
    let str_bytes = convert_str_to_bytes("MAXSTEG".to_string())
        + &message_len_bytes
        + &convert_str_to_bytes(message);
    if str_bytes.len() > img_bytes.len() {
        return Err("Message too large for image".to_string());
    }

    for (index, byte) in str_bytes.chars().enumerate() {
        let mut byte_str: Vec<char> = format!("{:08b}", img_bytes[index]).chars().collect();
        let last_idx = byte_str.len() - 1;
        byte_str[last_idx] = byte;
        let pixel = u8::from_str_radix(String::from_iter(byte_str).as_str(), 2).unwrap();
        img_bytes[index] = pixel;
    }
    Ok(img_bytes)
}

fn get_lsb(bytes: Vec<u8>) -> String {
    let mut lsb = String::new();
    for byte in bytes {
        let byte_str: Vec<char> = format!("{:b}", byte).chars().collect();
        let last_idx = byte_str.len() - 1;
        lsb += byte_str[last_idx].to_string().as_str();
    }
    lsb
}

fn convert_bytes_to_str(bytes: &str) -> String {
    let mut str_vecs: Vec<u8> = Vec::new();
    for i in 0..(bytes.len() / 8) {
        let integer = u8::from_str_radix(&bytes[(i * 8)..(i * 8) + 8], 2).unwrap();
        str_vecs.push(integer);
    }
    String::from_utf8(str_vecs).unwrap()
}

pub fn decode(image_path: PathBuf) -> Result<String, String> {
    let img_bytes = get_image_bytes(&image_path)?;
    let magic_len = convert_str_to_bytes("MAXSTEG".to_string()).len();
    let magic_lsb = get_lsb(img_bytes[..magic_len].to_vec());

    if convert_bytes_to_str(&magic_lsb) != "MAXSTEG".to_string() {
        return Err("unrecognised encoding".to_string());
    };

    let message_length_lsb = get_lsb(img_bytes[magic_len..magic_len + 32].to_vec());
    let message_length = u32::from_str_radix(&message_length_lsb, 2)
        .map_err(|_| "Invalid message length encoding".to_string())?;
    
    let required_len = magic_len + 32 + (message_length as usize);
    if required_len > img_bytes.len() {
        return Err("Message length exceeds image capacity".to_string());
    }
    let message_lsb =
        get_lsb(img_bytes[magic_len + 32..magic_len + 32 + message_length as usize].to_vec());

    Ok(convert_bytes_to_str(&message_lsb))
}