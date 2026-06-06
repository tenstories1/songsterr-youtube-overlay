document.getElementById('removeBtn').addEventListener('click', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      func: () => {
        const el = document.getElementById('yt-overlay-wrapper');
        if (el) el.remove();
      }
    });
  });
});