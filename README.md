# oPlayer Custom Themes 

Welcome to the official community theme repository for **oPlayer**. This repository hosts experimental, community-driven themes that you can download and install directly into your app to customize your listening experience.

> **⚠️⚠️ Disclaimer:** External themes are experimental and considered third-party content. Please install them at your own risk. ⚠️⚠️

---

##  How to Install a Theme

Installing a custom theme in oPlayer is quick and easy:

1. **Download a Theme:** Browse the [Available Themes](#-available-themes) below and download the `.zip` file to your Android device. *(Do not unzip the file).*
2. **Open oPlayer Settings:** Navigate to **Settings** → **Themes**.
3. **Enable External Themes:** Ensure the "Enable External Visual Themes" toggle is turned **On**.
4. **Import:** Tap **+ Import New Theme** and select the `.zip` file you just downloaded.
5. **Apply:** Once imported, select your new theme from the **Installed User Themes** list to apply it instantly!

---

##  Available Themes

###  8-Bit Theme (v1.0.0)
A nostalgic, retro pixel-art aesthetic for your music player.
* **Download:** [`8bitTheme.zip`](https://raw.githubusercontent.com/sghmire/oplayer-themes/main/builds/8bitTheme/1.0.0/8bitTheme.zip)

###  Ubuntu Theme (v1.0.0)
Clean, Linux-inspired styling featuring classic orange and dark aubergine accents.
* **Download:** [`ubuntuTheme.zip`](https://raw.githubusercontent.com/sghmire/oplayer-themes/main/builds/ubuntuTheme/1.0.0/ubuntuTheme.zip)

---

##  Build Your Own - Coming Soon!

Want to design your own custom skin for oPlayer? Because the UI is built entirely with web technologies, you have complete freedom to reshape the player however you want using standard HTML, CSS, and JavaScript.

** Check out the official [Theme Development Guide](THEME_DEVELOPMENT.md)** for full API documentation, boilerplate code, and testing instructions.

Once your theme is ready, you can submit a Pull Request following our contribution guidelines to get it listed in this community repository!

---

##  Repository Structure (For Maintainers)

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
├── index.json               <-- Master registry for the app
├── THEME_DEVELOPMENT.md     <-- API documentation for creators
└── README.md
