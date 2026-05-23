/* global React, ReactDOM */

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "dark",
  "accent": "aqua"
}/*EDITMODE-END*/;

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  React.useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-theme', t.theme);
    html.setAttribute('data-accent', t.accent);
  }, [t.theme, t.accent]);

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
          ['#67d6ee', '#0f1922', '#f3fbfd'],
          ['#ec8761', '#180f0c', '#fbf4f0'],
          ['#c9ee5e', '#0f1a08', '#f6fbed'],
          ['#b59afd', '#120e1c', '#f5f1fb']
        ]}
        onChange={(v) => {
          const name = v[0] === '#67d6ee' ? 'aqua'
                     : v[0] === '#ec8761' ? 'coral'
                     : v[0] === '#c9ee5e' ? 'lime'
                     : 'violet';
          setTweak('accent', name);
        }}
      />
      <div style={{
        marginTop: 14, paddingTop: 12,
        borderTop: '1px solid rgba(255,255,255,0.08)',
        fontSize: 11, fontFamily: 'ui-monospace, monospace',
        color: 'rgba(255,255,255,0.45)', lineHeight: 1.5
      }}>
        Settings sync to the homepage too.
      </div>
    </TweaksPanel>
  );
}

const __twkRoot = document.createElement('div');
document.body.appendChild(__twkRoot);
ReactDOM.createRoot(__twkRoot).render(<TweaksApp />);
