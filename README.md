# oPlayer Custom Themes 🎨

Welcome to the official community theme repository for **oPlayer**. This repository hosts experimental, community-driven themes that you can download and install directly into your app to customize your listening experience.

> **⚠️ Disclaimer:** External themes are experimental and considered third-party content. Please install them at your own risk.

---

## 📥 How to Install a Theme

Installing a custom theme in oPlayer is quick and easy:

1. **Download a Theme:** Browse the [Available Themes](#-available-themes) below and download the `.zip` file to your Android device. *(Do not unzip the file).*
2. **Open oPlayer Settings:** Navigate to **Settings** → **Themes**.
3. **Enable External Themes:** Ensure the "Enable External themes" toggle is turned **On**.
4. **Import:** Tap **+ Import New Theme** and select the `.zip` file you just downloaded.
5. **Apply:** Once imported, select your new theme from the **Installed User Themes** list to apply it instantly!

---

## 🖼️ Available Themes

### 👾 8-Bit Theme (v1.0.0)
A nostalgic, retro pixel-art aesthetic for your music player.
* **Download:** [`8bitTheme.zip`](https://raw.githubusercontent.com/sghmire/oplayer-themes/main/builds/8bitTheme/1.0.0/8bitTheme.zip)

### 🐧 Ubuntu Theme (v1.0.0)
Clean, Linux-inspired styling featuring classic orange and dark aubergine accents.
* **Download:** [`ubuntuTheme.zip`](https://raw.githubusercontent.com/sghmire/oplayer-themes/main/builds/ubuntuTheme/1.0.0/ubuntuTheme.zip)

---

## 🛠️ Repository Structure (For Maintainers)

To ensure the app can reliably fetch and verify themes in the future, this repository follows a strict versioning structure:

```text
oplayer-themes/
├── builds/
│   ├── 8bitTheme/
│   │   └── 1.0.0/
│   │       └── 8bitTheme.zip
│   └── ubuntuTheme/
│       └── 1.0.0/
│           └── ubuntuTheme.zip
├── index.json  <-- Master registry for the app
└── README.md
