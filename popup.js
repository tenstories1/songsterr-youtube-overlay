const toggle = document.getElementById('muteToggle');

chrome.storage.local.get({ midiMuted: true }, ({ midiMuted }) => {
  toggle.checked = midiMuted;
});

// Open Songsterr tabs pick this up instantly via storage.onChanged
toggle.addEventListener('change', () => {
  chrome.storage.local.set({ midiMuted: toggle.checked });
});
