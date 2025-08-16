export const dynamic = 'force-static'

export default function ImpressumPage() {
  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Impressum</h1>
      <div className='rounded-lg border border-site-700 bg-site-800 p-4'>
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

      <section className='prose prose-invert max-w-none'>
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
