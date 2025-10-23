export const dynamic = 'force-static'

export default function PrivacyPage() {
  return (
    <div className='space-y-12'>
      {/* Header Section */}
      <section className='space-y-4'>
        <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>
          Datenschutzerklärung
        </h1>
        <p className='text-lg text-site-100 max-w-2xl'>
          Wir nehmen den Schutz deiner Daten ernst. Diese Erklärung informiert dich 
          über die Verarbeitung deiner Daten auf dieser Website.
        </p>
      </section>

      {/* Responsible Party Card */}
      <div className='glass rounded-xl p-6 md:p-8 space-y-4'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 rounded-lg bg-kolping-400/20 flex items-center justify-center flex-shrink-0'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-5 h-5 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-site-50'>Verantwortlich für den Inhalt</h2>
        </div>
        
        <div className='space-y-3 pl-13'>
          <div>
            <div className='text-site-100 text-sm'>Name</div>
            <div className='text-site-50 font-medium'>Johannes Stüber</div>
          </div>
          <div>
            <div className='text-site-100 text-sm'>Adresse</div>
            <div className='text-site-50 font-medium'>
              Fischerstraße 12<br />
              01945 Ruhland
            </div>
          </div>
          <div>
            <div className='text-site-100 text-sm'>E-Mail</div>
            <a
              href='mailto:hyper.xjo@gmail.com'
              className='text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded transition-colors'
            >
              hyper.xjo@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className='space-y-12'>
        {/* Overview */}
        <section className='space-y-4'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.63l2.96 3.83c.52.68 1.58.68 2.1 0 .52-.68.14-1.69-.54-2.38l-.41-.53h1.54l1.97-2.5H13.9z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Allgemeines</h2>
          </div>
          <div className='text-site-100'>
            <p>
              Nachfolgend informieren wir über die Verarbeitung personenbezogener Daten beim Besuch dieser Website.
              Wir verarbeiten deine Daten nur soweit dies notwendig ist und unter Beachtung der DSGVO.
            </p>
          </div>
        </section>

        {/* Hosting */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Hosting (Cloudflare Pages)</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <div className='space-y-2'>
              <h3 className='font-semibold text-site-50'>Verarbeitete Daten</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li>IP-Adresse</li>
                <li>Datum und Uhrzeit</li>
                <li>Angefragte URL und Assets</li>
                <li>Referrer und User-Agent</li>
                <li>Geräte- und Browser-Informationen</li>
              </ul>
            </div>
            
            <div className='space-y-2 pt-4 border-t border-site-700'>
              <h3 className='font-semibold text-site-50'>Zwecke</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li>Bereitstellung der Website</li>
                <li>Stabilitätsverbessering</li>
                <li>DDoS-Schutz</li>
                <li>Fehlersuche und Optimierung</li>
              </ul>
            </div>

            <div className='space-y-2 pt-4 border-t border-site-700'>
              <h3 className='font-semibold text-site-50'>Rechtsgrundlage</h3>
              <p className='text-sm'>Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse)</p>
            </div>

            <div className='pt-4 border-t border-site-700'>
              <a
                href='https://www.cloudflare.com/privacypolicy/'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded transition-colors text-sm'
              >
                <span>Datenschutzerklärung von Cloudflare</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-4 h-4'
                  aria-hidden='true'
                >
                  <path fillRule='evenodd' d='M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z' clipRule='evenodd' />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Web Analytics */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Webanalyse (Cloudflare Web Analytics)</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <p className='text-sm'>
              Wir setzen datenschutzfreundliche Webanalyse ein. Die erfassten Metriken erfolgen in aggregierter Form 
              und ermöglichen keine personenbezogene Identifikation.
            </p>
            
            <div className='space-y-2 bg-site-800/30 rounded p-4'>
              <h3 className='font-semibold text-site-50'>Besonderheiten:</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li>Keine Tracking-Cookies</li>
                <li>Kein Cross-Site-Tracking</li>
                <li>Keine Werbe-/Profiling-Dienste</li>
                <li>Metriken: Seitenaufrufe, Referrer, Gerät/Browser, Land/Region</li>
              </ul>
            </div>

            <div className='space-y-2 pt-4 border-t border-site-700'>
              <h3 className='font-semibold text-site-50'>Zweck</h3>
              <p className='text-sm'>Reichweitenmessung und Stabilitätsverbesserung der Website</p>
            </div>

            <div className='pt-4 border-t border-site-700'>
              <a
                href='https://www.cloudflare.com/web-analytics/'
                target='_blank'
                rel='noreferrer'
                className='inline-flex items-center gap-2 text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded transition-colors text-sm'
              >
                <span>Mehr Infos zu Cloudflare Web Analytics</span>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  viewBox='0 0 20 20'
                  fill='currentColor'
                  className='w-4 h-4'
                  aria-hidden='true'
                >
                  <path fillRule='evenodd' d='M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z' clipRule='evenodd' />
                </svg>
              </a>
            </div>
          </div>
        </section>

        {/* Server Logs */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Server-Logdaten</h2>
          </div>

          <div className='space-y-2 text-site-100'>
            <ul className='list-disc pl-5 space-y-1 text-sm'>
              <li>Verwendung ausschließlich für Betriebssicherheit und Fehleranalyse</li>
              <li>Kurzfristige Aufbewahrung, keine Zusammenführung mit anderen Daten</li>
              <li>Keine Erstellung von Nutzerprofilen</li>
            </ul>
          </div>
        </section>

        {/* External Content */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83l1.41 1.41L19 6.41V10h2V3h-7z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Externe Inhalte & Verlinkungen</h2>
          </div>

          <div className='space-y-2 text-site-100'>
            <ul className='list-disc pl-5 space-y-1 text-sm'>
              <li>Keine eingebetteten externen Widgets</li>
              <li>Verlinkte Inhalte (z. B. YouTube) werden erst beim Klick geladen</li>
              <li>Ab dem Aufruf gelten die Datenschutzbestimmungen der Drittanbieter</li>
            </ul>
          </div>
        </section>

        {/* Contact for Data Rights */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12h-8v-2h8v2zm0-3h-8V9h8v2zm0-3H4V4h14v4z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Kontakt & Deine Rechte</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <div className='space-y-2'>
              <h3 className='font-semibold text-site-50'>Kontaktaufnahme</h3>
              <p className='text-sm'>
                Bei Fragen zum Datenschutz oder zur Geltendmachung von Rechten kannst du dich an folgende Adresse wenden:
              </p>
              <a
                href='mailto:hyper.xjo@gmail.com'
                className='inline-block text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 rounded transition-colors text-sm'
              >
                hyper.xjo@gmail.com
              </a>
              <p className='text-sm pt-2'>
                Bei einer E-Mail-Kontaktaufnahme werden deine Angaben ausschließlich zur Bearbeitung der Anfrage 
                verarbeitet und danach gelöscht, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
              </p>
            </div>

            <div className='space-y-2 pt-4 border-t border-site-700'>
              <h3 className='font-semibold text-site-50'>Deine Rechte</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li>Recht auf Auskunft über deine Daten</li>
                <li>Recht auf Berichtigung falscher Daten</li>
                <li>Recht auf Löschung</li>
                <li>Recht auf Einschränkung der Verarbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
                <li>Recht auf Widerspruch gegen Verarbeitungen</li>
                <li>Beschwderecht bei einer Datenschutzaufsichtsbehörde</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Updates */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Änderungen dieser Erklärung</h2>
          </div>

          <div className='text-site-100'>
            <p className='text-sm'>
              Diese Datenschutzerklärung wird aktualisiert, sobald sich technische oder rechtliche 
              Rahmenbedingungen ändern. Schau regelmäßig vorbei, um über Änderungen informiert zu sein.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}
