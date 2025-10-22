export const dynamic = "force-static";

export default function ContactPage() {
  return (
    <div className="space-y-12">
      <h1 className="font-display text-3xl md:text-4xl font-extrabold tracking-tight">
        Kontakt
      </h1>
      <div className="glass rounded-xl p-6 md:p-8">
        <div className="font-semibold mb-1">Wir proben jeden Mittwoch</div>
        <div>Uhrzeit: 19:00 Uhr</div>
        <div>Addresse: Klosterhof 7, 67305 Ramsen</div>
        <br />
        <div>Bei Interesse gerne uns im Vorfeld kontaktieren über:</div>
        <div>
          <a
            href="mailto:kolpingjugendramsen@gmail.com"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded transition-colors"
            aria-label="E-Mail"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M3.75 5.25 3 6v12l.75.75h16.5L21 18V6l-.75-.75H3.75Zm.75 2.446v9.554h15V7.695L12 14.514 4.5 7.696Zm13.81-.946H5.69L12 12.486l6.31-5.736Z"
              />
            </svg>
            <span>E-Mail</span>
          </a>
        </div>
        <div>
          <a
            href="https://www.instagram.com/kolpingjugend_ramsen/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 hover:text-kolping-400 focus:outline-none focus:ring-2 focus:ring-kolping-400 focus:ring-offset-2 focus:ring-offset-site-900 rounded transition-colors"
            aria-label="Instagram"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="18"
              height="18"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11 5.5 5.5 0 0 1 0-11zm0 2a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM18 6.8a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            <span>Instagram</span>
          </a>
        </div>
      </div>
    </div>
  );
}
