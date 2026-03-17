# Ubuntu Ambiance Theme (External)

This folder contains the source files for the Ubuntu-inspired oPlayer theme.

## Files
- `manifest.json`
- `index.html`
- `style.css`
- `theme.js`

## Create import ZIP locally

From this folder:

```bash
zip -q ubuntuTheme.zip manifest.json index.html style.css theme.js
```

This keeps the repository text-only while still making theme import packaging straightforward.


## Public catalog

This theme can also be published/distributed via:
- https://github.com/sghmire/oplayer-themes


## Publish to public catalog repo

From this private app repository root:

```bash
scripts/sync_theme_to_public_repo.sh External_themes/ubuntuTheme /tmp/oplayer-themes
```

This syncs source files and builds `dist/ubuntu_ambiance.zip` in the cloned public repository.
