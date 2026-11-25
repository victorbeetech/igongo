# S11. Files & Media

[All screens](README.md) · [Module spec](../../modules/11-files-media.md)

## Screens

| No. | Screen | Where | Route | What it is for | Opened from | Opens |
| --- | --- | --- | --- | --- | --- | --- |
| <a id="s11-01"></a>S11-01 | File browser | Web | `/files-media/file-browser` | Folders per module and record | Role home, [S01-01 Console home](01-super-admin.md#s01-01) | D11-01 Upload, S11-02 File viewer, S11-03 Storage usage, S11-04 Files settings |
| <a id="s11-02"></a>S11-02 | File viewer | App, Web | `/files-media/file-viewer` | View a photo, PDF or video, with annotation | S11-01 File browser | D11-02 Delete file |
| <a id="s11-03"></a>S11-03 | Storage usage | Web | `/files-media/storage-usage` | Quota per module | S11-01 File browser | Back only |
| <a id="s11-04"></a>S11-04 | Files settings | Web | `/files-media/files-settings` | Maximum file size and allowed file types per module; Storage quota per module and alerts when near; How long files are kept, per module; Whether downloads... | S11-01 File browser | Back only |

## Dialogs, sheets and confirmations

| No. | Dialog | What it is for | Opened from |
| --- | --- | --- | --- |
| <a id="d11-01"></a>D11-01 | Upload | Pick from camera, gallery or computer | S11-01 File browser |
| <a id="d11-02"></a>D11-02 | Delete file | Confirm, with where the file is used | S11-02 File viewer |

## States on every screen

Loading, empty, error, offline, permission denied and success. Every list also has its search, filter and no-results state.

Every screen has a back action to the screen that opened it, and every dialog returns to the screen under it.
