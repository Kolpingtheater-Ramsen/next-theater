export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="space-y-4">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
          Kontakt
        </h1>
        <p className="text-lg text-site-100 max-w-2xl">
          Du hast Interesse an unserem Theater? Wir freuen uns auf deine Nachricht! 
          Kontaktiere uns gerne – egal ob als Spieler, Zuschauer oder einfach nur neugierig.
        </p>
      </section>

      {/* Main Contact Info Grid */}
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {/* Rehearsal Info */}
        <div className="glass rounded-xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-kolping-400/20 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-kolping-400"
                  aria-hidden="true"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-site-50">Probenzeiten</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="text-sm uppercase tracking-wider text-kolping-400 font-semibold">
                Regelmäßige Proben
              </div>
              <div className="text-base md:text-lg text-site-50 font-medium">Jeden Mittwoch</div>
              <div className="text-site-100">19:00 Uhr</div>
            </div>
            
            <div className="space-y-1 pt-2 border-t border-site-700">
              <div className="text-sm uppercase tracking-wider text-kolping-400 font-semibold">
                Spielort
              </div>
              <div className="text-site-50">Klosterhof 7</div>
              <div className="text-site-50">67305 Ramsen</div>
            </div>

            <div className="space-y-1 pt-2 border-t border-site-700">
              <div className="text-sm uppercase tracking-wider text-kolping-400 font-semibold">
                Anfahrt
              </div>
              <a
                href="https://maps.google.com/?q=Klosterhof+7,+67305+Ramsen"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-kolping-400 hover:text-kolping-500 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded transition-colors"
              >
                <span>In Google Maps öffnen</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Methods */}
        <div className="glass rounded-xl p-6 md:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-kolping-400/20 flex items-center justify-center flex-shrink-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-5 h-5 text-kolping-400"
                  aria-hidden="true"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-site-50">Schreib uns</h2>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-site-100 text-sm md:text-base">
              Hast du Fragen oder möchtest bei uns mitmachen? Kontaktiere uns direkt:
            </p>

            <div className="space-y-3 pt-2">
              <a
                href="mailto:kolpingjugendramsen@gmail.com"
                className="flex items-center gap-3 p-4 rounded-lg bg-site-800/50 hover:bg-site-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-kolping-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-kolping-400/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-kolping-400"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M3.75 5.25 3 6v12l.75.75h16.5L21 18V6l-.75-.75H3.75Zm.75 2.446v9.554h15V7.695L12 14.514 4.5 7.696Zm13.81-.946H5.69L12 12.486l6.31-5.736Z"
                    />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm uppercase tracking-wider text-kolping-400 font-semibold">E-Mail</div>
                  <div className="text-site-50 group-hover:text-kolping-400 transition-colors">
                    kolpingjugendramsen@gmail.com
                  </div>
                </div>
              </a>

              <a
                href="https://www.instagram.com/kolpingjugend_ramsen/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-4 rounded-lg bg-site-800/50 hover:bg-site-800 transition-colors group"
              >
                <div className="w-10 h-10 rounded-lg bg-kolping-400/20 flex items-center justify-center flex-shrink-0 group-hover:bg-kolping-400/30 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-5 h-5 text-kolping-400"
                    aria-hidden="true"
                  >
                    <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="text-sm uppercase tracking-wider text-kolping-400 font-semibold">Instagram</div>
                  <div className="text-site-50 group-hover:text-kolping-400 transition-colors">
                    @kolpingjugend_ramsen
                  </div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Interest Section */}
      <div className="glass rounded-xl p-6 md:p-8 space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-kolping-400/20 flex items-center justify-center flex-shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-kolping-400"
                aria-hidden="true"
              >
                <path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-site-50">Interessiert?</h2>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-site-100">
            Falls du vor dem ersten Besuch lieber mit uns Kontakt aufnehmen möchtest, schreib uns eine E-Mail oder folge uns auf Instagram. Wir freuen uns auf dich!
          </p>
          
          <div className="grid sm:grid-cols-3 gap-4 pt-4">
            <div className="bg-site-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-kolping-400 mb-1">🎭</div>
              <div className="text-sm font-semibold text-site-50">Spieler gesucht</div>
              <div className="text-xs text-site-100 mt-1">Egal ob Anfänger oder Profi</div>
            </div>
            
            <div className="bg-site-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-kolping-400 mb-1">🎬</div>
              <div className="text-sm font-semibold text-site-50">Hinter der Bühne</div>
              <div className="text-xs text-site-100 mt-1">Technik, Dekoration & mehr</div>
            </div>
            
            <div className="bg-site-800/50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-kolping-400 mb-1">👥</div>
              <div className="text-sm font-semibold text-site-50">Gemeinschaft</div>
              <div className="text-xs text-site-100 mt-1">Spaß & guter Zusammenhalt</div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ or CTA Section */}
      <div className="border border-site-700 rounded-xl p-6 md:p-8 space-y-6 bg-site-900/50">
        <h2 className="font-display text-2xl font-bold text-site-50">Häufig gestellte Fragen</h2>
        
        <div className="space-y-4">
          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 px-4 bg-site-800/50 rounded-lg hover:bg-site-800 transition-colors font-semibold text-site-50">
              <span>Muss ich Theater-Erfahrung haben?</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="px-4 py-3 text-site-100 border-t border-site-700 mt-2">
              Nein! Bei uns sind Anfänger genauso willkommen wie erfahrene Schauspieler. Wir sind eine inklusiv orientierte Gruppe und unterstützen uns gegenseitig.
            </div>
          </details>

          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 px-4 bg-site-800/50 rounded-lg hover:bg-site-800 transition-colors font-semibold text-site-50">
              <span>Wann beginnt die nächste Spielsaison?</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="px-4 py-3 text-site-100 border-t border-site-700 mt-2">
              Die aktuelle Spielsaison findest du auf der Startseite. Proben finden regelmäßig statt – schreib einfach uns eine Nachricht!
            </div>
          </details>

          <details className="group cursor-pointer">
            <summary className="flex items-center justify-between py-3 px-4 bg-site-800/50 rounded-lg hover:bg-site-800 transition-colors font-semibold text-site-50">
              <span>Kann ich als nicht Schauspieler mithelfen?</span>
              <svg
                className="w-5 h-5 transition-transform group-open:rotate-180"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>
            </summary>
            <div className="px-4 py-3 text-site-100 border-t border-site-700 mt-2">
              Ja! Wir suchen immer Helfer bei der Vorbereitung, Technik, Dekoration und vielem mehr. Kontaktiere uns, um herauszufinden, wie du uns unterstützen kannst.
            </div>
          </details>
        </div>
      </div>
    </div>
  );
}
