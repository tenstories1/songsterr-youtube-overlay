# Songsterr YouTube Overlay
A Chrome extension that mutes Songsterr's MIDI playback so you hear the YouTube audio instead, and auto-dismisses the "continue with sync pauses" popup

---

## Features

 - Mutes Songsterr's MIDI/synth audio (Web Audio) output
 - Auto-dismisses the "continue with sync pauses" popup
 - Toggle MIDI muting on/off from the extension popup — applies instantly, no reload

 ---


 ## Installation

 This extension is not on the Chrome web store. You must load it locally.

 1. Download or clone this repository
 2. Open Chrome (version 111 or newer) and navigate to `chrome://extensions`
 3. Enable **Developer Mode** toggle in the top right corner
 4. Click **Load Unpacked**
 5. Select the `1.1.0` folder
 6. The extension is now active

 ---

 ## Usage

1. Go to [songsterr.com](https://www.songsterr.com) and open any song
2. The extension automatically:
   - Mutes the MIDI audio output
   - Clicks "continue with sync pauses" whenever that popup appears
3. To **hear the MIDI again**, click the extension icon in your toolbar and untick **Mute MIDI**

---

## File Structure

```
1.1.0/
├── manifest.json      # Extension config and permissions
├── mute.js            # Page-world script: mutes Web Audio output
├── content.js         # Popup dismissal + relays mute setting to mute.js
├── popup.html         # Toolbar popup UI
├── popup.js           # Mute toggle logic
└── README.md
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| MIDI still audible | Reload the Songsterr tab after installing/updating — `mute.js` must load before the page's audio starts |
| Popup isn't dismissed | Songsterr may have changed the link text; update `SYNC_PAUSES_XPATH` in `content.js` |
| Extension won't load | Requires Chrome 111+ (for `"world": "MAIN"` content scripts) |

---

| Permission | Reason |
|---|---|
| `storage` | Remembers the Mute MIDI setting |
| `*://*.songsterr.com/*` (content script match) | Limits the scripts to Songsterr pages only |

---

## Disclaimer

This extension is intended for personal use. It does not bypass any login wall or download any content — it only adjusts what audio plays in your own browser session.
