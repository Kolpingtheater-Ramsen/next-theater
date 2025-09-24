export const dynamic = 'force-static'

export default function ImpressumPage() {
  return (
    <div className='space-y-12'>
      <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>Impressum</h1>
      <div className='glass rounded-xl p-6 md:p-8'>
        <div className='font-semibold mb-1'>Angaben gemäß § 5 TMG</div>
        <div>Johannes Stüber</div>
        <div>Fischerstraße 12</div>
        <div>01945 Ruhland</div>
        <div className='mt-2 text-sm'>
          E-Mail:{' '}
          <a
            className='underline text-kolping-400'
            href='mailto:hyper.xjo@gmail.com'
          >
            hyper.xjo@gmail.com
          </a>
        </div>
      </div>

      <section className='prose prose-invert max-w-none prose-headings:font-display prose-headings:tracking-tight prose-headings:font-extrabold prose-h2:text-2xl md:prose-h2:text-3xl'>
        <h2>Haftung für Inhalte</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>Eigene Inhalte nach § 7 Abs. 1 TMG, nach allgemeinen Gesetzen</li>
          <li>Keine generelle Überwachungspflicht für fremde Informationen (§§ 8–10 TMG)</li>
          <li>Pflichten zur Entfernung/Sperrung ab Kenntnis rechtswidriger Inhalte bleiben unberührt</li>
        </ul>

        <h2>Urheberrecht</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>Alle Inhalte unterliegen dem deutschen Urheberrecht</li>
          <li>Beiträge Dritter sind entsprechend gekennzeichnet</li>
          <li>Nutzung außerhalb der Schranken nur mit schriftlicher Zustimmung</li>
        </ul>
      </section>
    </div>
  )
}
