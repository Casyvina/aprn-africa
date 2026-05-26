export default function StudioLogo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 4px' }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo-icon.png"
        alt="APRN"
        style={{ height: '28px', width: 'auto', objectFit: 'contain' }}
      />
      <span style={{
        fontFamily: 'Inter, system-ui, sans-serif',
        fontWeight: 700,
        fontSize: '13px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        color: '#C9901A',
      }}>
        APRN Studio
      </span>
    </div>
  )
}
