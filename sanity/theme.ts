import { buildLegacyTheme } from 'sanity'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const aprnTheme = buildLegacyTheme({
  '--black':      '#071B2A',
  '--white':      '#ffffff',
  '--gray':       '#64748b',
  '--gray-base':  '#334155',

  '--component-bg':         '#071B2A',
  '--component-text-color': '#e2e8f0',

  '--brand-primary': '#C9901A',

  '--main-navigation-color':           '#051524',
  '--main-navigation-color--inverted': '#C9901A',

  '--focus-color': '#C9901A',

  '--state-info-color':    '#3b82f6',
  '--state-success-color': '#10b981',
  '--state-warning-color': '#f59e0b',
  '--state-danger-color':  '#ef4444',

  '--radius': '2px',

  '--font-family-sans-serif': 'Inter, system-ui, sans-serif',
  '--font-family-monospace':  'monospace',
// eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any)
