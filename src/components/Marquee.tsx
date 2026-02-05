type MarqueeProps = {
  items: { date?: string; title: string; marjor?: boolean }[]
}

export default function Marquee({ items }: MarqueeProps) {
  const doubled = [...items, ...items]
  return (
    <div className='marquee bg-site-800/50'>
      <div className='marquee__track py-3 px-4 text-[13px] sm:text-sm uppercase tracking-wider text-site-100'>
        {doubled.map((it, i) => (
          <div key={i} className='flex items-center gap-2.5 whitespace-nowrap'>
            {it.marjor ? (
              <span className='text-kolping-400 text-[10px]'>&#9670;</span>
            ) : (
              <span className='text-site-100/40 text-[10px]'>&#9670;</span>
            )}
            <span className='text-site-100/50 tabular-nums'>{it.date}</span>
            <span className={it.marjor ? 'font-semibold text-site-50' : 'font-medium text-site-100/80'}>
              {it.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
