# Pixel Cipher

A modern, cross-platform Tauri application for hiding text messages within images using **Least Significant Bit (LSB) steganography**.

## Features

- **Encode Messages:** Securely embed hidden text data inside standard image files without noticeably altering their appearance.
- **Decode Messages:** Extract and read previously hidden text from steganographic images.
- **Built-in Image Scanner:** Automatically scans and organizes local directories (like Downloads and Pictures) for image files that can be encoded or decoded.
- **Cross-Platform Support:** Works on desktop platforms (Windows, macOS, Linux) and Android, powered by the robust Tauri v2 framework.
- **Modern UI/UX:** A highly responsive, single-page application experience with smooth page transitions and real-time feedback.

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4, TypeScript
- **State & Data:** Redux Toolkit, React Query
- **Routing & Animations:** React Router, Framer Motion
- **Backend Core:** Rust, Tauri v2, `image` crate (for lightning-fast native steganography processing)

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+ recommended)
- [Rust](https://www.rust-lang.org/tools/install) (latest stable)
- [Tauri prerequisites](https://tauri.app/v1/guides/getting-started/prerequisites) (e.g., C++ build tools on Windows)

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Maxessien/PixelCipherTauri.git
   cd pixelcipher-tauri
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run in development mode:**
   ```bash
   npm run tauri dev
   ```
   *This starts both the Vite local development server and the Rust backend, opening the application window.*

4. **Build for production:**
   ```bash
   npm run tauri build
   ```
   *This compiles the React frontend and builds standard, optimized native binaries for your OS.*

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

## License

This project is open-source and available under the standard MIT License.