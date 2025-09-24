export const dynamic = 'force-static'

export default function PrivacyPage() {
  return (
    <div className='space-y-12'>
      <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>Datenschutz</h1>
      {/* Owner card */}
      <div className='glass rounded-xl p-6 md:p-8'>
        <div className='font-semibold mb-1'>Verantwortlich für den Inhalt</div>
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
        <h2>Allgemeines</h2>
        <p>
          Nachfolgend informieren wir über die Verarbeitung personenbezogener
          Daten beim Besuch dieser Website.
        </p>

        <h2>Hosting (Cloudflare Pages)</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>Auslieferung über das CDN von Cloudflare Pages</li>
          <li>
            Verarbeitete Daten: IP-Adresse, Datum/Zeit, angefragte URL/Assets,
            Referrer, User-Agent, Geräte-/Browser-Infos
          </li>
          <li>
            Zwecke: Bereitstellung der Website, Stabilität, DDoS-Schutz,
            Fehlersuche
          </li>
          <li>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)
          </li>
          <li>Rolle von Cloudflare: Auftragsverarbeiter</li>
        </ul>
        <p>
          Weitere Informationen finden Sie in der{' '}
          <a
            className='underline text-kolping-400'
            href='https://www.cloudflare.com/privacypolicy/'
            target='_blank'
            rel='noreferrer'
          >
            Datenschutzerklärung von Cloudflare
          </a>
          .
        </p>

        <h2>Webanalyse (Cloudflare Web Analytics)</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>Datenschutzfreundliche Webanalyse von Cloudflare</li>
          <li>
            Erfasste Metriken in aggregierter Form, z. B. Seitenaufrufe,
            Referer, Gerät/Browser, Land/Region
          </li>
          <li>
            Keine personenbezogene Identifikation, kein Cross‑Site‑Tracking
          </li>
          <li>
            Es werden keine Tracking-Cookies gesetzt und keine
            Werbe-/Profiling-Dienste eingesetzt
          </li>
          <li>
            Zweck: Reichweitenmessung und Stabilitätsverbesserung der Website
          </li>
          <li>
            Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse
            an anonymisierter Nutzungsanalyse)
          </li>
        </ul>
        <p>
          Weitere Informationen:{' '}
          <a
            className='underline text-kolping-400'
            href='https://www.cloudflare.com/web-analytics/'
            target='_blank'
            rel='noreferrer'
          >
            Cloudflare Web Analytics
          </a>
          .
        </p>

        <h2>Server-Logdaten</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>
            Verwendung ausschließlich für Betriebssicherheit und Fehleranalyse
          </li>
          <li>
            Kurzfristige Aufbewahrung, keine Zusammenführung mit anderen Daten
          </li>
          <li>Keine Erstellung von Nutzerprofilen</li>
        </ul>

        <h2>Externe Inhalte & Verlinkungen</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>Keine eingebetteten externen Widgets</li>
          <li>
            Verlinkte Inhalte (z. B. YouTube) werden erst beim Klick geladen
          </li>
          <li>
            Ab dem Aufruf gelten die Datenschutzbestimmungen der Drittanbieter
          </li>
        </ul>

        <h2>Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz wenden Sie sich bitte an den oben genannten
          Verantwortlichen. E-Mail:{' '}
          <a
            className='underline text-kolping-400'
            href='mailto:hyper.xjo@gmail.com'
          >
            hyper.xjo@gmail.com
          </a>
          . Bei einer Kontaktaufnahme per E-Mail werden Ihre Angaben
          ausschließlich zur Bearbeitung der Anfrage verarbeitet (Art. 6 Abs. 1
          lit. b oder f DSGVO) und anschließend gelöscht, sofern keine
          gesetzlichen Aufbewahrungspflichten bestehen.
        </p>

        <h2>Ihre Rechte</h2>
        <ul className='list-disc pl-6 space-y-1'>
          <li>Auskunft, Berichtigung, Löschung</li>
          <li>Einschränkung der Verarbeitung und Datenübertragbarkeit</li>
          <li>Widerspruch gegen bestimmte Verarbeitungen</li>
          <li>Beschwerderecht bei einer Datenschutzaufsichtsbehörde</li>
        </ul>

        <h2>Änderungen</h2>
        <p>
          Diese Hinweise werden aktualisiert, sobald sich technische oder
          rechtliche Rahmenbedingungen ändern.
        </p>
      </section>
    </div>
  )
}
