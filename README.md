# Songsterr YouTube Overlay
A Chrome extension that mutes Songsterr's MIDI playback and overlays the official YouTube audio instead

---

## Features

 - Mutes MIDI audio and replaces it with original YouTube audio
 - Overlays original YouTube video in the normal spot
 - Auto detects linked song on YouTube
 - Removable via extension pop up (if you want MIDI for some reason)

 ---


 ## Installation

 This extension is not on the Chrome web store. You must load it locally.

 1. Download or clone this repository
 2. Open Chrome and navigate to `chrome://extensions`
 3. Enable **Developer Mode** toggle in the top right corner
 4. Click **Load Unpacked**
 5. Select the `songsterr-youtube-overlay` folder
 6. The extension is now active

 ---

 ## Usage

 1. Go to [songsterr.com](https://www.songsterr.com) and open any song
2. The extension automatically:
   - Mutes the MIDI audio output
   - Detects the song's linked YouTube video
   - Injects a YouTube player in the bottom-right corner of the page
3. Press play on the YouTube overlay to hear the real track
4. To **remove the overlay**, click the extension icon in your toolbar and hit **Remove Overlay**

---

## File Structure
 
```
songsterr-youtube-overlay/
├── manifest.json      # Extension config and permissions
├── content.js         # Core logic: MIDI muting + YouTube injection
├── popup.html         # Toolbar popup UI
├── popup.js           # Popup button logic
└── README.md
```
 
---

## Troubleshooting
 
| Problem | Fix |
|---|---|
| MIDI still audible | Change `"run_at": "document_idle"` to `"document_start"` in `manifest.json` so the audio intercept runs earlier |
| No YouTube overlay appears | Open DevTools → Network tab, look for API responses containing a YouTube URL, and update `getYouTubeId()` in `content.js` to match |
| YouTube won't autoplay | Click anywhere on the page first, then reload — Chrome requires a user gesture before autoplay is permitted |
| Extension won't load | Ensure `"version"` in `manifest.json` is in `1.0.0` format (1–4 dot-separated integers) |
 
---

| Permission | Reason |
|---|---|
| `activeTab` | Allows the popup to interact with the current tab |
| `scripting` | Allows the popup to inject the remove-overlay script |
| `*://*.songsterr.com/*` | Limits content script to Songsterr pages only |
 
---

## Disclaimer
 
This extension is intended for personal use. It does not bypass any login wall or download any content — it only adjusts what audio plays in your own browser session.
 