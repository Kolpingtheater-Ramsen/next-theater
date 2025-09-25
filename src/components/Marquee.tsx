type MarqueeProps = {
  items: { date?: string; title: string }[]
}

export default function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div className='marquee border border-site-700 rounded-lg bg-site-800'>
      <div className='marquee__track py-2 px-3 sm:px-4 text-[13px] sm:text-sm uppercase tracking-wide text-site-100'>
        {doubled.map((it, i) => (
          <div key={i} className='flex items-center gap-2 whitespace-nowrap'>
            <span className='text-kolping-400'>◆</span>
            {it.date ? (
              <span className='opacity-80'>{it.date}</span>
            ) : null}
            <span className='font-semibold'>{it.title}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

