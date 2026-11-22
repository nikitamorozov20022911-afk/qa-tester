async page => {
  await page.addInitScript(() => {
    window.__gumMode = localStorage.getItem('qaGumMode') || 'tone';
    window.__gumCalls = 0;
    navigator.mediaDevices.getUserMedia = async (c) => {
      window.__gumCalls++;
      const mode = localStorage.getItem('qaGumMode') || 'tone';
      if (mode === 'deny') { throw new DOMException('Permission denied', 'NotAllowedError'); }
      const ctx = new AudioContext(); const dst = ctx.createMediaStreamDestination();
      if (mode === 'tone') { const o = ctx.createOscillator(); o.frequency.value = 440; const g = ctx.createGain(); g.gain.value = 0.5; o.connect(g); g.connect(dst); o.start(); }
      return dst.stream;
    };
  });
  return 'stub installed';
}
