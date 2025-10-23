export const dynamic = 'force-static'

export default function ImpressumPage() {
  return (
    <div className='space-y-12'>
      {/* Header Section */}
      <section className='space-y-4'>
        <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>
          Impressum
        </h1>
        <p className='text-lg text-site-100 max-w-2xl'>
          Angaben zur Betreiber dieser Website gemäß § 5 TMG (Telemediengesetz).
        </p>
      </section>

      {/* Website Operator Card */}
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
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-13c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5z' />
            </svg>
          </div>
          <h2 className='text-xl font-bold text-site-50'>Betreiberin der Website</h2>
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
              01945 Ruhland<br />
              Deutschland
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

      {/* Legal Information Sections */}
      <div className='space-y-12'>
        {/* Liability for Content */}
        <section className='space-y-4'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Haftung für Inhalte</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <p className='text-sm'>
              Die Inhalte unserer Website wurden mit großer Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit 
              und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen. Als Diensteanbieter sind wir 
              gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten verantwortlich.
            </p>

            <div className='space-y-2 bg-site-800/30 rounded p-4'>
              <h3 className='font-semibold text-site-50 text-sm'>Nach §§ 8–10 TMG sind wir:</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li><strong>Nicht verpflichtet,</strong> fremde Informationen zu überwachen oder nach Umständen zu forschen, 
                  die auf rechtswidrige Tätigkeit hinweisen</li>
                <li><strong>Verpflichtet,</strong> Informationen zu entfernen oder zu sperren, wenn wir von einer rechtswidrigen 
                  Tätigkeit Kenntnis erlangen</li>
              </ul>
            </div>

            <p className='text-sm pt-4 border-t border-site-700'>
              Diese Haftungsbeschränkung gilt nicht für Schadensersatzansprüche aus Verletzung von Pflichten, 
              die sich aus den gesetzlichen Bestimmungen ergeben.
            </p>
          </div>
        </section>

        {/* Copyright & Usage Rights */}
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
            <h2 className='font-display text-2xl font-bold text-site-50'>Urheberrecht</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <p className='text-sm'>
              Die durch die Seitenbetreiberin erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen 
              Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der 
              Grenzen des Urheberrechts bedürfen der schriftlichen Zustimmung des Autors oder Urhebers.
            </p>

            <div className='space-y-2 bg-site-800/30 rounded p-4'>
              <h3 className='font-semibold text-site-50 text-sm'>Berücksichtigte Drittinhalte:</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li>Beiträge von Dritten sind deutlich als solche gekennzeichnet</li>
                <li>Die Nutzung von Drittinhalten unterliegt deren Lizenzbedingungen</li>
                <li>Bei unbefugter Verwendung erfolgt sofortige Benachrichtigung durch den Rechteinhaber</li>
              </ul>
            </div>

            <p className='text-sm pt-4 border-t border-site-700'>
              <strong>Lizenzfreie Nutzungen:</strong> Downloads und Kopien dieser Seite sind nur für den privaten 
              Gebrauch gestattet. Eine Weiterverbreitung oder Nutzung zu kommerziellen Zwecken ist ohne ausdrückliche 
              schriftliche Zustimmung nicht gestattet.
            </p>
          </div>
        </section>

        {/* Third-Party Links */}
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
            <h2 className='font-display text-2xl font-bold text-site-50'>Verlinkung & externe Inhalte</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <p className='text-sm'>
              Diese Website enthält Links zu externen Webseiten Dritter. Für den Inhalt dieser externen Seiten 
              übernehmen wir keine Haftung.
            </p>

            <div className='space-y-2 bg-site-800/30 rounded p-4'>
              <h3 className='font-semibold text-site-50 text-sm'>Verantwortung für Links:</h3>
              <ul className='list-disc pl-5 space-y-1 text-sm'>
                <li>Externe Links werden regelmäßig auf Gültigkeit überprüft</li>
                <li>Sollte ein Link fehlerhaft sein, melden Sie dies bitte per E-Mail</li>
                <li>Wir haften nicht für Inhalte fremder Websites</li>
              </ul>
            </div>

            <p className='text-sm pt-4 border-t border-site-700'>
              Die Seite, auf der ein Link angebracht ist, wurde zum Zeitpunkt der Linklegung auf illegale Inhalte 
              überprüft. Sollten wir Kenntnis von Rechtsverletzungen erhalten, werden wir solche Links sofortig entfernen.
            </p>
          </div>
        </section>

        {/* Data Protection */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Datenschutz</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <p className='text-sm'>
              Die Nutzung unserer Website ist in der Regel ohne Angabe personenbezogener Daten möglich. Insoweit 
              auf unseren Seiten personenbezogene Daten (beispielsweise Name, Anschrift oder E-Mail-Adresse) erhoben 
              werden, erfolgt dies auf freiwilliger Basis.
            </p>

            <div className='space-y-2 bg-site-800/30 rounded p-4'>
              <h3 className='font-semibold text-site-50 text-sm'>Datenschutz-Information:</h3>
              <p className='text-sm'>
                Detaillierte Informationen zum Schutz Ihrer Daten finden Sie in unserer <a href='/privacy' className='text-kolping-400 hover:text-kolping-500 transition-colors'>Datenschutzerklärung</a>.
              </p>
            </div>
          </div>
        </section>

        {/* Dispute Resolution */}
        <section className='space-y-4 border-t border-site-700 pt-8'>
          <div className='flex items-center gap-3'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 24 24'
              fill='currentColor'
              className='w-6 h-6 text-kolping-400'
              aria-hidden='true'
            >
              <path d='M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2V17zm4 0h-2V7h2V17zm4 0h-2v-4h2V17z' />
            </svg>
            <h2 className='font-display text-2xl font-bold text-site-50'>Streitbeilegung</h2>
          </div>

          <div className='space-y-4 text-site-100'>
            <p className='text-sm'>
              Wir sind zur Teilnahme an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht 
              verpflichtet und nehmen daran nicht teil.
            </p>

            <div className='space-y-2 bg-site-800/30 rounded p-4'>
              <h3 className='font-semibold text-site-50 text-sm'>EU-Streitbeilegung:</h3>
              <p className='text-sm'>
                Die EU-Kommission stellt eine Plattform zur Online-Streitbeilegung bereit, die unter <a href='http://ec.europa.eu/consumers/odr/' target='_blank' rel='noreferrer' className='text-kolping-400 hover:text-kolping-500 transition-colors break-words'>ec.europa.eu/consumers/odr/</a> erreichbar ist.
              </p>
            </div>

            <p className='text-sm pt-4 border-t border-site-700'>
              Zur Teilnahme an Streitbeilegungsverfahren sind wir gemäß § 36 VSBG verpflichtet. Diese Website 
              wird betrieben von einer natürlichen Person, die nicht als Unternehmer gilt und daher nicht 
              verpflichtet ist, sich in das Verbraucherstreitbeilegungsregister eintragen zu lassen.
            </p>
          </div>
        </section>
      </div>

      {/* Quick Contact Section */}
      <div className='border border-site-700 rounded-xl p-6 md:p-8 space-y-4 bg-site-900/50'>
        <h2 className='font-display text-xl font-bold text-site-50'>Fragen zum Impressum?</h2>
        <p className='text-site-100'>
          Kontaktiere uns gerne bei Fragen oder Anmerkungen:
        </p>
        <a
          href='mailto:hyper.xjo@gmail.com'
          className='inline-flex items-center gap-2 px-4 py-2 bg-kolping-400/20 hover:bg-kolping-400/30 text-kolping-400 rounded-lg transition-colors font-semibold'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='currentColor'
            className='w-5 h-5'
            aria-hidden='true'
          >
            <path d='M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z' />
          </svg>
          hyper.xjo@gmail.com
        </a>
      </div>
    </div>
  )
}
