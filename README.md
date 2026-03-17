# oPlayer Community Themes (Experimental)

This folder mirrors what you’ll push to GitHub for manual theme downloads. The feature is experimental — use at your own risk.

## How to Install (Manual ZIP)
1) Download a theme ZIP from the GitHub repo below.
2) In oPlayer: Settings → Themes → + Import New Theme.
3) Select the ZIP. After install, pick it under “User Themes.”

## GitHub Repo (publish these files there)
- Repo URL: https://github.com/<org>/oplayer-themes
- Machine index (for future auto-fetch): https://raw.githubusercontent.com/<org>/oplayer-themes/main/index.json

## Themes to publish
- **8-Bit Theme v1.0.0** — Retro pixel look  
  ZIP path (in repo): `builds/8bitTheme/1.0.0/8bitTheme.zip`
- **Ubuntu Theme v1.0.0** — Ubuntu-inspired styling  
  ZIP path (in repo): `builds/ubuntuTheme/1.0.0/ubuntuTheme.zip`

## After uploading to GitHub
1) Place each ZIP under `builds/<id>/<version>/` (keep old versions).
2) Update `index.json` with the final URLs and `sha256` checksums for each ZIP.
3) Keep this README at repo root so users see the instructions.

## Checksums
Compute after upload, e.g.:
```
shasum -a 256 builds/8bitTheme/1.0.0/8bitTheme.zip
shasum -a 256 builds/ubuntuTheme/1.0.0/ubuntuTheme.zip
```
Paste the hashes into `index.json`.

## Disclaimer
Experimental: themes are third-party content; install at your own risk.
