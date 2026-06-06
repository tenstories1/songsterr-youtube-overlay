// Mutes any MIDI / web audio output
const AudioContext = window.AudioContext || window.webkitAudioContext;
const OriginalAudioContext = AudioContext;
window.AudioContext = window.webkitAudioContext = function(...args) {
  const ctx = new OriginalAudioContext(...args);
  // Mute the master output
  ctx.destination.channelCount = 1;
  const muter = ctx.createGain();
  muter.gain.value = 0;
  muter.connect(ctx.destination);
  // Reroute any future connections to the muted gain node
  const origConnect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function(dest, ...rest) {
    if (dest === ctx.destination) {
      return origConnect.call(this, muter, ...rest);
    }
    return origConnect.call(this, dest, ...rest);
  };
  return ctx;
};

// Finds YouTube video ID from the Songsterr Page
function getYouTubeId() {
  // Checking Songsterr page for meta tags or the DOM (they embed YouTube data in the page)
  const ogVideo = document.querySelector('meta[property="og:video"]');
  if (ogVideo) {
    const match = ogVideo.content.match(/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  // Fallback: scan all script tags for a YouTube ID
  const scripts = document.querySelectorAll('script');
  for (const s of scripts) {
    const match = s.textContent.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
    if (match) return match[1];
  }
  return null;
}

// Injecting YouTube iframe overlay
function injectYouTubeOverlay(videoId) {
  if (document.getElementById('yt-overlay-iframe')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'yt-overlay-wrapper';
  wrapper.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 280px;
    height: 158px;
    z-index: 99999;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.5);
    background: #000;
  `;

  const iframe = document.createElement('iframe');
  iframe.id = 'yt-overlay-iframe';
  // autoplay=1, mute=0 so you hear the real audio
  iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1`;
  iframe.style.cssText = 'width:100%;height:100%;border:none;';
  iframe.allow = 'autoplay; encrypted-media';

  wrapper.appendChild(iframe);
  document.body.appendChild(wrapper);
}

// Watch for playback starting
function waitForPlayback() {
  const observer = new MutationObserver(() => {
    const videoId = getYouTubeId();
    if (videoId) {
      injectYouTubeOverlay(videoId);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });

  // Also try immediately on load
  const videoId = getYouTubeId();
  if (videoId) injectYouTubeOverlay(videoId);
}

waitForPlayback();