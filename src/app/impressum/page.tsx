export const dynamic = 'force-static'

export default function ImpressumPage() {
  return (
    <div className='space-y-8'>
      <h1 className='text-3xl font-bold'>Impressum</h1>
      <section className='prose prose-invert max-w-none'>
        <h2>Angaben gemäß § 5 TMG</h2>
        <p>
          Johannes Stüber
          <br />
          Fischerstraße 12
          <br />
          01945 Ruhland
        </p>

        <h2>Kontakt</h2>
        <p>
          E-Mail: auf Anfrage bei Veranstaltungen oder über die bekannten Kanäle
          des Kolping-Open-Air-Theaters Ramsen.
        </p>

        <h2>Haftung für Inhalte</h2>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 TMG sind wir jedoch nicht verpflichtet, übermittelte oder
          gespeicherte fremde Informationen zu überwachen oder nach Umständen zu
          forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
        </p>

        <h2>Urheberrecht</h2>
        <p>
          Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen
          Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind
          als solche gekennzeichnet. Vervielfältigung, Bearbeitung, Verbreitung
          und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes
          bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw.
          Erstellers.
        </p>
      </section>
    </div>
  )
}
