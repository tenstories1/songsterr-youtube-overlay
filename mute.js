// ── Mute Songsterr's MIDI/synth audio output ──────────────────────────────────
// Runs in the page's own JS world at document_start, so the patch is in place
// before Songsterr creates its AudioContext. (A regular content script runs in
// an isolated world and can't touch the page's Web Audio objects at all.)
(() => {
  const MUTE_EVENT = 'songsterr-overlay:set-muted';
  const proto = AudioNode.prototype;
  const origConnect = proto.connect;
  const origDisconnect = proto.disconnect;
  const muters = new Map(); // AudioDestinationNode -> GainNode
  let muted = true;

  // One muting gain node per audible destination, created lazily
  function muterFor(dest) {
    if (!(dest instanceof AudioDestinationNode)) return null;
    if (window.OfflineAudioContext && dest.context instanceof OfflineAudioContext) return null;
    let gain = muters.get(dest);
    if (!gain) {
      gain = dest.context.createGain();
      gain.gain.value = muted ? 0 : 1;
      origConnect.call(gain, dest);
      muters.set(dest, gain);
    }
    return gain;
  }

  // Patched once on the prototype (1.0.x re-wrapped connect for every new
  // AudioContext, stacking a wrapper per context on every connect call)
  proto.connect = function (...args) {
    const gain = muterFor(args[0]);
    if (!gain) return origConnect.apply(this, args);
    const dest = args[0];
    args[0] = gain;
    origConnect.apply(this, args);
    return dest;
  };

  // Keep disconnect(destination) working, since the node is really wired to the muter
  proto.disconnect = function (...args) {
    const gain = args.length ? muters.get(args[0]) : undefined;
    if (gain) args[0] = gain;
    return origDisconnect.apply(this, args);
  };

  // Toggled live from the popup via content.js
  document.addEventListener(MUTE_EVENT, (e) => {
    muted = e.detail !== false;
    for (const gain of muters.values()) gain.gain.value = muted ? 0 : 1;
  });
})();
