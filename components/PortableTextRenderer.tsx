import { PortableText, type PortableTextComponents } from 'next-sanity'

type CalloutValue = { _type: 'callout'; title?: string; text: string }
type ImageValue  = { _type: 'image'; asset?: { url?: string }; alt?: string; caption?: string }

const components: PortableTextComponents = {
  block: {
    normal: ({ children }) => (
      <p className="text-slate-300 leading-8 text-lg mb-6" style={{ fontFamily: 'var(--font-inter), sans-serif' }}>
        {children}
      </p>
    ),
    h2: ({ children }) => (
      <h2
        className="text-3xl font-bold text-white mt-12 mb-4 pt-4 border-t border-navy-800"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3
        className="text-2xl font-bold text-white mt-12 mb-4 pt-4 border-t border-navy-800"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4
        className="text-xl font-bold text-white mt-8 mb-3"
        style={{ fontFamily: 'var(--font-playfair), serif' }}
      >
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gold-500 pl-6 my-10 py-1">
        <p
          className="text-xl text-gold-500 italic leading-relaxed"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          {children}
        </p>
      </blockquote>
    ),
  },

  marks: {
    strong: ({ children }) => (
      <strong className="font-bold text-white">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic text-slate-200">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-navy-800 text-gold-500 px-1.5 py-0.5 rounded text-sm font-mono">
        {children}
      </code>
    ),
    link: ({ children, value }) => (
      <a
        href={value?.href}
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-gold-500 underline underline-offset-2 hover:text-gold-400 transition-colors"
      >
        {children}
      </a>
    ),
  },

  types: {
    callout: ({ value }: { value: CalloutValue }) => (
      <div className="glass-panel border border-gold-500/20 rounded-sm p-6 my-8">
        {value.title && (
          <div className="text-xs font-semibold text-gold-500 uppercase tracking-widest mb-3">
            {value.title}
          </div>
        )}
        <p className="text-slate-300 text-sm leading-relaxed">{value.text}</p>
      </div>
    ),
    image: ({ value }: { value: ImageValue }) =>
      value.asset?.url ? (
        <figure className="my-10">
          <img
            src={value.asset.url}
            alt={value.alt ?? ''}
            className="w-full rounded-sm"
          />
          {value.caption && (
            <figcaption className="text-center text-xs text-slate-500 mt-3 uppercase tracking-wider">
              {value.caption}
            </figcaption>
          )}
        </figure>
      ) : null,
  },

  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-outside pl-6 space-y-2 mb-6 text-slate-300">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-outside pl-6 space-y-2 mb-6 text-slate-300">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="leading-7">{children}</li>,
    number: ({ children }) => <li className="leading-7">{children}</li>,
  },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function PortableTextRenderer({ value }: { value: any[] }) {
  if (!value?.length) return null
  return <PortableText value={value} components={components} />
}
