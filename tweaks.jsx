/* global React, ReactDOM */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "aqua",
  "frame": "art",
  "heroLayout": "left"
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // push tweaks down into the page (CSS attrs + viewer rebuild)
  React.useEffect(() => {
    if (window.__applyDesignTweaks) window.__applyDesignTweaks(t);
  }, [t.theme, t.accent, t.frame]);

  // hero layout — toggle a body class
  React.useEffect(() => {
    document.body.classList.toggle('hero-centered', t.heroLayout === 'centered');
  }, [t.heroLayout]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio
        label="Mode"
        value={t.theme}
        options={['dark', 'light']}
        onChange={(v) => setTweak('theme', v)}
      />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={[
          ['#67d6ee', '#0f1922', '#f3fbfd'],  // aqua
          ['#ec8761', '#180f0c', '#fbf4f0'],  // coral
          ['#c9ee5e', '#0f1a08', '#f6fbed'],  // lime
          ['#b59afd', '#120e1c', '#f5f1fb']   // violet
        ]}
        onChange={(v) => {
          const name = v[0] === '#67d6ee' ? 'aqua'
                     : v[0] === '#ec8761' ? 'coral'
                     : v[0] === '#c9ee5e' ? 'lime'
                     : 'violet';
          setTweak('accent', name);
        }}
      />

      <TweakSection label="Demo image" />
      <TweakRadio
        label="Use case"
        value={t.frame}
        options={['art', 'micro', 'maps']}
        onChange={(v) => setTweak('frame', v)}
      />

      <TweakSection label="Hero" />
      <TweakRadio
        label="Layout"
        value={t.heroLayout}
        options={['left', 'centered']}
        onChange={(v) => setTweak('heroLayout', v)}
      />

      <div style={{
        marginTop: 14, paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: 11, fontFamily: 'ui-monospace, monospace',
        color: 'rgba(255,255,255,0.45)', lineHeight: 1.5
      }}>
        The hero viewer is real OpenSeadragon. Drag, scroll, pinch — tiles
        are synthesized client-side so it works fully offline.
      </div>
    </TweaksPanel>
  );
}

const __twkRoot = document.createElement('div');
document.body.appendChild(__twkRoot);
ReactDOM.createRoot(__twkRoot).render(<TweaksApp />);
