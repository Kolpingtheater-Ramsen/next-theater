export default function AnnoGalleryComingSoon() {
  return (
    <div className='space-y-12'>
      <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>Anno 1146</h1>
      <div className='glass rounded-xl p-6 md:p-8'>
        <p className='text-site-100'>
          Die Galerie ist bald verfügbar. Schaut in der Zwischenzeit gerne auf unserer
          {' '}<a
            href='https://www.instagram.com/kolpingjugend_ramsen/'
            target='_blank'
            rel='noopener noreferrer'
            className='text-kolping-400 hover:text-kolping-300 underline underline-offset-4'
          >
            Instagram-Seite
          </a>
          {' '}vorbei.
        </p>
      </div>
    </div>
  )
}

