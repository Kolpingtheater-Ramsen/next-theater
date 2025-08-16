export const dynamic = 'force-static'

export default function PrivacyPage() {
  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Datenschutz</h1>
      <section className='prose prose-invert max-w-none'>
        <h2>Verantwortlich für den Inhalt</h2>
        <p>
          Johannes Stüber
          <br />
          Fischerstraße 12
          <br />
          01945 Ruhland
        </p>

        <h2>Hosting (Cloudflare Pages)</h2>
        <p>
          Diese Website wird über Cloudflare Pages ausgeliefert. Beim Aufruf der
          Seiten verarbeitet Cloudflare technisch notwendige Daten, um die
          Auslieferung und Sicherheit (DDoS-Schutz, Fehlerdiagnose) zu
          gewährleisten. Dazu gehören insbesondere IP-Adresse, Datum/Uhrzeit,
          aufgerufene Ressourcen, Referrer, User-Agent sowie
          Geräte-/Browser-Informationen. Die Verarbeitung erfolgt auf Grundlage
          von Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse an einem
          sicheren und zuverlässigen Betrieb der Website). Cloudflare agiert als
          Auftragsverarbeiter. Weitere Informationen finden Sie in der
          Datenschutzerklärung von Cloudflare.
        </p>

        <h2>Keine Cookies, keine Analyse</h2>
        <p>
          Diese Website setzt keine Tracking-Cookies ein und verwendet keine
          Analyse- oder Marketing-Dienste.
        </p>

        <h2>Server-Logdaten</h2>
        <p>
          Server- bzw. Edge-Protokolle werden ausschließlich zum Zweck der
          Betriebssicherheit und Fehleranalyse verarbeitet und anschließend
          kurzzeitig vorgehalten. Eine Zusammenführung dieser Daten mit anderen
          Datenquellen oder eine Profilbildung findet nicht statt.
        </p>

        <h2>Externe Inhalte & Verlinkungen</h2>
        <p>
          Wir binden keine externen Widgets ein. Verlinkte Inhalte (z. B.
          YouTube-Trailer) werden erst beim Anklicken der Links geöffnet; ab
          diesem Zeitpunkt gelten die Datenschutzbestimmungen der jeweiligen
          Anbieter.
        </p>

        <h2>Kontakt</h2>
        <p>
          Bei Fragen zum Datenschutz wenden Sie sich bitte an den oben genannten
          Verantwortlichen. E-Mail:{' '}
          <a href='mailto:hyper.xjo@gmail.com'>hyper.xjo@gmail.com</a>. Bei
          einer Kontaktaufnahme per E-Mail werden Ihre Angaben ausschließlich
          zur Bearbeitung der Anfrage verarbeitet (Art. 6 Abs. 1 lit. b oder f
          DSGVO) und anschließend gelöscht, sofern keine gesetzlichen
          Aufbewahrungspflichten bestehen.
        </p>

        <h2>Ihre Rechte</h2>
        <p>
          Ihnen stehen die Rechte auf Auskunft, Berichtigung, Löschung,
          Einschränkung der Verarbeitung, Datenübertragbarkeit sowie Widerspruch
          gegen bestimmte Verarbeitungen zu. Sie haben außerdem das Recht, sich
          bei einer Datenschutzaufsichtsbehörde zu beschweren.
        </p>

        <h2>Änderungen</h2>
        <p>
          Wir passen diese Hinweise an, sobald sich technische oder rechtliche
          Änderungen ergeben.
        </p>
      </section>
    </div>
  )
}
