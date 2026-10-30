// ── Relay the popup's mute setting to mute.js (page world) ────────────────────
const MUTE_EVENT = 'songsterr-overlay:set-muted';

function sendMuteState(muted) {
  document.dispatchEvent(new CustomEvent(MUTE_EVENT, { detail: muted }));
}

chrome.storage.local.get({ midiMuted: true }, ({ midiMuted }) => sendMuteState(midiMuted));
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && changes.midiMuted) sendMuteState(changes.midiMuted.newValue);
});

// ── Dismiss "continue with sync pauses" popup only ────────────────────────────
// A single native XPath lookup instead of reading textContent of every <a> in JS
const SYNC_PAUSES_XPATH =
  "//a[translate(normalize-space(.), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz')" +
  "='continue with sync pauses']";

function dismissPopup() {
  const link = document.evaluate(
    SYNC_PAUSES_XPATH, document.body, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
  ).singleNodeValue;
  if (link) {
    link.click();
    console.log('[Songsterr Overlay] Dismissed popup');
  }
}

// Throttled observer — checks at most once per 300ms no matter how
// many DOM mutations fire (Songsterr mutates constantly while playing)
let throttleTimer = null;
const observer = new MutationObserver(() => {
  if (throttleTimer) return;
  throttleTimer = setTimeout(() => {
    throttleTimer = null;
    dismissPopup();
  }, 300);
});

observer.observe(document.body, { childList: true, subtree: true });

// Check immediately on load too
dismissPopup();
