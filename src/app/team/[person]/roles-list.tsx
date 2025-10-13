'use client'

import { useState, useEffect } from 'react'

type Role = {
  role: string
  play: string
}

type RolesListProps = {
  roles: Role[]
  personId: string
}

// Generate particle positions outside component to avoid SSR issues
const particles = Array.from({ length: 50 }).map(() => ({
  x: Math.random() * 1600 - 800,
  y: -(Math.random() * 800 + 200),
  scale: Math.random() * 1.5 + 0.5,
  duration: Math.random() * 1 + 1.5,
  delay: Math.random() * 0.3,
}))

const shards = Array.from({ length: 28 }).map(() => ({
  x: Math.random() * 1400 - 700,
  y: -(Math.random() * 700 + 150),
  rotate: Math.random() * 720 - 360,
  size: Math.random() * 12 + 6,
  duration: Math.random() * 0.9 + 1.0,
  delay: Math.random() * 0.25,
  color: ['#9ca3af', '#6b7280', '#f59e0b', '#ef4444'][
    Math.floor(Math.random() * 4)
  ],
}))

const smokes = Array.from({ length: 12 }).map(() => ({
  x: Math.random() * 60 - 30, // horizontal drift in px
  scale: Math.random() * 1.2 + 0.8,
  duration: Math.random() * 2 + 1.5,
  delay: Math.random() * 0.4 + 0.2,
}))

export default function RolesList({ roles, personId }: RolesListProps) {
  const [exploded, setExploded] = useState(false)
  const [shaking, setShaking] = useState(false)

  // Function to play 8-bit explosion sound
  const play8BitExplosion = () => {
    if (typeof window === 'undefined') return

    const AudioContextCtor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AudioContextCtor) return
    const audioContext = new AudioContextCtor()
    const now = audioContext.currentTime

    // Create oscillators for the explosion sound
    const oscillator1 = audioContext.createOscillator()
    const oscillator2 = audioContext.createOscillator()
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.5, audioContext.sampleRate)
    const noiseData = noiseBuffer.getChannelData(0)
    
    // Generate white noise for explosion texture
    for (let i = 0; i < noiseBuffer.length; i++) {
      noiseData[i] = Math.random() * 2 - 1
    }
    
    const noiseSource = audioContext.createBufferSource()
    noiseSource.buffer = noiseBuffer

    const gainNode1 = audioContext.createGain()
    const gainNode2 = audioContext.createGain()
    const noiseGain = audioContext.createGain()
    const masterGain = audioContext.createGain()

    // Low frequency boom
    oscillator1.type = 'sawtooth'
    oscillator1.frequency.setValueAtTime(120, now)
    oscillator1.frequency.exponentialRampToValueAtTime(40, now + 0.3)

    // High frequency crack
    oscillator2.type = 'square'
    oscillator2.frequency.setValueAtTime(800, now)
    oscillator2.frequency.exponentialRampToValueAtTime(100, now + 0.1)

    // Envelope for oscillator 1 (boom)
    gainNode1.gain.setValueAtTime(0.4, now)
    gainNode1.gain.exponentialRampToValueAtTime(0.01, now + 0.4)

    // Envelope for oscillator 2 (crack)
    gainNode2.gain.setValueAtTime(0.3, now)
    gainNode2.gain.exponentialRampToValueAtTime(0.01, now + 0.15)

    // Envelope for noise
    noiseGain.gain.setValueAtTime(0.5, now)
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2)

    // Master volume
    masterGain.gain.setValueAtTime(0.3, now)

    // Connect the nodes
    oscillator1.connect(gainNode1)
    oscillator2.connect(gainNode2)
    noiseSource.connect(noiseGain)
    
    gainNode1.connect(masterGain)
    gainNode2.connect(masterGain)
    noiseGain.connect(masterGain)
    
    // Add a short echo tail for epic feel
    const delayNode = audioContext.createDelay()
    delayNode.delayTime.value = 0.12
    const feedback = audioContext.createGain()
    feedback.gain.value = 0.35
    const lowpass = audioContext.createBiquadFilter()
    lowpass.type = 'lowpass'
    lowpass.frequency.value = 1200

    masterGain.connect(audioContext.destination)
    masterGain.connect(delayNode)
    delayNode.connect(feedback)
    feedback.connect(delayNode)
    delayNode.connect(lowpass)
    lowpass.connect(audioContext.destination)

    // Start and stop
    oscillator1.start(now)
    oscillator2.start(now)
    noiseSource.start(now)
    
    oscillator1.stop(now + 0.4)
    oscillator2.stop(now + 0.15)
    noiseSource.stop(now + 0.2)
  }

  useEffect(() => {
    if (exploded) {
      // Play explosion sound
      play8BitExplosion()
      
      // Start with a very strong shake, then decay to a milder shake
      setShaking(true)
      document.body.classList.add('page-exploded-strong')

      const switchTimer = setTimeout(() => {
        document.body.classList.remove('page-exploded-strong')
        document.body.classList.add('page-exploded')
      }, 700)

      // Stop shaking after 3 seconds
      const shakeTimer = setTimeout(() => {
        setShaking(false)
        document.body.classList.remove('page-exploded')
      }, 3000)

      // Clean up effect completely after 5 seconds
      const cleanupTimer = setTimeout(() => {
        setExploded(false)
      }, 5000)

      return () => {
        clearTimeout(switchTimer)
        clearTimeout(shakeTimer)
        clearTimeout(cleanupTimer)
        document.body.classList.remove('page-exploded')
        document.body.classList.remove('page-exploded-strong')
      }
    }
  }, [exploded])

  const handleRoleClick = (role: string, play: string) => {
    // Easter egg: if it's Yunus clicking on "Thomas" from "Goldfieber"
    if (
      personId.toLowerCase() === 'yunus' &&
      role === 'Thomas' &&
      play.includes('Goldfieber')
    ) {
      setExploded(true)
    }
  }

  return (
    <>
      <ul className='mt-2 grid sm:grid-cols-2 gap-2 text-sm'>
        {roles.map((x, i) => {
          const isEasterEgg =
            personId.toLowerCase() === 'yunus' &&
            x.role === 'Thomas' &&
            x.play.includes('Goldfieber')

          return (
            <li
              key={`${x.play}-${i}`}
              onClick={() => handleRoleClick(x.role, x.play)}
              className={`flex items-start gap-2 rounded border border-site-700 bg-site-800 p-2 ${
                isEasterEgg ? 'cursor-pointer hover:bg-site-700 transition-colors' : ''
              }`}
            >
              <span className='min-w-0'>
                <span className='text-site-100 block text-xs'>{x.play}</span>
                <span className='font-medium'>{x.role}</span>
              </span>
            </li>
          )
        })}
      </ul>

      {/* Explosion Effect */}
      {exploded && (
        <>
          {/* Flash effect */}
          <div className='fixed inset-0 z-[10000] pointer-events-none bg-orange-500 animate-[flash_0.5s_ease-out]' />

          {/* BOOM text */}
          <div className='fixed inset-0 z-[10000] pointer-events-none flex items-center justify-center'>
            <div className='font-display text-5xl md:text-7xl lg:text-8xl font-extrabold text-white animate-[boom-text_1s_ease-out_forwards]'
              style={{ textShadow: '0 0 30px rgba(255,128,0,1), 0 0 60px rgba(255,64,0,0.8)' }}
            >
              BOOM!
            </div>
          </div>

          {/* Explosion particles */}
          <div className='fixed inset-0 z-[9999] pointer-events-none overflow-hidden'>
            {particles.map((particle, i) => (
              <div
                key={i}
                className='absolute top-1/2 left-1/2 rounded-full'
                style={{
                  width: `${particle.scale * 20}px`,
                  height: `${particle.scale * 20}px`,
                  backgroundColor: [
                    '#ff6b00',
                    '#ff8800',
                    '#ffaa00',
                    '#ff0000',
                    '#ffcc00',
                    '#ff3300',
                  ][i % 6],
                  transform: 'translate(-50%, -50%)',
                  animation: `explosion-particle ${particle.duration}s ease-out ${particle.delay}s forwards`,
                  '--particle-x': `${particle.x}px`,
                  '--particle-y': `${particle.y}px`,
                  boxShadow: '0 0 10px currentColor',
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Debris shards */}
          <div className='fixed inset-0 z-[9998] pointer-events-none overflow-hidden'>
            {shards.map((s, i) => (
              <div
                key={`shard-${i}`}
                className='absolute top-1/2 left-1/2'
                style={{
                  width: `${s.size}px`,
                  height: `${s.size * 0.35}px`,
                  backgroundColor: s.color,
                  transform: 'translate(-50%, -50%) rotate(0deg)',
                  animation: `shard-fly ${s.duration}s cubic-bezier(0.22, 0.61, 0.36, 1) ${s.delay}s forwards`,
                  boxShadow: '0 0 12px rgba(255,255,255,0.15)',
                  borderRadius: '2px',
                  // custom variables to target in keyframes
                  ['--shard-x' as const]: `${s.x}px`,
                  ['--shard-y' as const]: `${s.y}px`,
                  ['--shard-rot' as const]: `${s.rotate}deg`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Shockwave */}
          <div className='fixed inset-0 z-[9998] pointer-events-none flex items-center justify-center'>
            <div className='absolute w-0 h-0 rounded-full border-4 border-orange-500 animate-[shockwave_1s_ease-out_forwards]' />
            <div className='absolute w-0 h-0 rounded-full border-4 border-red-500 animate-[shockwave_1s_ease-out_0.2s_forwards]' />
          </div>

          {/* Smoke plumes */}
          <div className='fixed inset-0 z-[9997] pointer-events-none overflow-hidden'>
            {smokes.map((sm, i) => (
              <div
                key={`smoke-${i}`}
                className='absolute top-1/2 left-1/2 rounded-full'
                style={{
                  width: `${sm.scale * 70}px`,
                  height: `${sm.scale * 70}px`,
                  background:
                    'radial-gradient(circle at 50% 50%, rgba(120,120,120,0.35), rgba(120,120,120,0.05) 60%, rgba(0,0,0,0) 70%)',
                  filter: 'blur(6px)',
                  transform: 'translate(-50%, -50%)',
                  animation: `smoke-rise ${sm.duration}s ease-out ${sm.delay}s forwards`,
                  ['--smoke-x' as const]: `${sm.x}px`,
                } as React.CSSProperties}
              />
            ))}
          </div>

          {/* Screen cracks */}
          <div className={`fixed inset-0 z-[9997] pointer-events-none transition-opacity duration-1000 ${!shaking ? 'opacity-0' : 'opacity-100'}`}>
            <svg className='absolute inset-0 w-full h-full'>
              <defs>
                <filter id='crack-glow'>
                  <feGaussianBlur stdDeviation='2' />
                  <feColorMatrix
                    values='1 0 0 0 0
                            0 0 0 0 0
                            0 0 0 0 0
                            0 0 0 1 0'
                  />
                </filter>
              </defs>
              <g className='animate-[crack-appear_0.8s_ease-out_forwards]' opacity='0'>
                <path
                  d='M 50 0 Q 55 30 50 50 Q 45 70 50 100'
                  stroke='rgba(255, 50, 50, 0.6)'
                  strokeWidth='3'
                  fill='none'
                  vectorEffect='non-scaling-stroke'
                  filter='url(#crack-glow)'
                />
                <path
                  d='M 0 40 Q 30 45 50 40 Q 70 35 100 40'
                  stroke='rgba(255, 50, 50, 0.5)'
                  strokeWidth='2'
                  fill='none'
                  vectorEffect='non-scaling-stroke'
                />
                <path
                  d='M 20 0 L 80 100'
                  stroke='rgba(255, 50, 50, 0.4)'
                  strokeWidth='2'
                  fill='none'
                  vectorEffect='non-scaling-stroke'
                />
                <path
                  d='M 80 0 L 20 100'
                  stroke='rgba(255, 50, 50, 0.3)'
                  strokeWidth='2'
                  fill='none'
                  vectorEffect='non-scaling-stroke'
                />
              </g>
            </svg>
          </div>

          {/* Vignette flicker */}
          <div
            className='fixed inset-0 z-[9996] pointer-events-none'
            style={{
              background:
                'radial-gradient(ellipse at center, rgba(0,0,0,0) 40%, rgba(0,0,0,0.7) 100%)',
              animation: 'vignette-flicker 0.8s ease-out forwards',
            }}
          />

          {/* Global styles */}
          <style jsx global>{`
            @keyframes page-exploded-strong-shake {
              0% { transform: translate(0, 0) rotate(0deg); }
              10% { transform: translate(-25px, 12px) rotate(-2deg); }
              20% { transform: translate(22px, -10px) rotate(2deg); }
              30% { transform: translate(-20px, -8px) rotate(-1deg); }
              40% { transform: translate(18px, 8px) rotate(1deg); }
              50% { transform: translate(-14px, 6px) rotate(-0.6deg); }
              60% { transform: translate(12px, -4px) rotate(0.6deg); }
              70% { transform: translate(-8px, 3px) rotate(-0.4deg); }
              80% { transform: translate(6px, -2px) rotate(0.3deg); }
              90% { transform: translate(-3px, 1px) rotate(-0.2deg); }
              100% { transform: translate(0, 0) rotate(0deg); }
            }

            @keyframes page-exploded-shake {
              0%,
              100% {
                transform: translate(0, 0) rotate(0deg);
              }
              10% {
                transform: translate(-10px, 5px) rotate(-1deg);
              }
              20% {
                transform: translate(10px, -5px) rotate(1deg);
              }
              30% {
                transform: translate(-8px, -3px) rotate(-0.5deg);
              }
              40% {
                transform: translate(8px, 3px) rotate(0.5deg);
              }
              50% {
                transform: translate(-5px, 2px) rotate(-0.3deg);
              }
              60% {
                transform: translate(5px, -2px) rotate(0.3deg);
              }
              70% {
                transform: translate(-3px, 1px) rotate(-0.2deg);
              }
              80% {
                transform: translate(3px, -1px) rotate(0.2deg);
              }
              90% {
                transform: translate(-1px, 0px) rotate(-0.1deg);
              }
            }

            @keyframes flash {
              0% {
                opacity: 0;
              }
              50% {
                opacity: 0.8;
              }
              100% {
                opacity: 0;
              }
            }

            @keyframes explosion-particle {
              0% {
                transform: translate(-50%, -50%) scale(1);
                opacity: 1;
              }
              100% {
                transform: translate(
                    calc(-50% + var(--particle-x)),
                    calc(-50% + var(--particle-y))
                  )
                  scale(0);
                opacity: 0;
              }
            }

            @keyframes shard-fly {
              0% { transform: translate(-50%, -50%) rotate(0deg); opacity: 1; }
              100% { transform: translate(calc(-50% + var(--shard-x)), calc(-50% + var(--shard-y))) rotate(var(--shard-rot)); opacity: 0; }
            }

            @keyframes shockwave {
              0% {
                width: 0;
                height: 0;
                opacity: 1;
              }
              100% {
                width: 200vmax;
                height: 200vmax;
                opacity: 0;
              }
            }

            @keyframes crack-appear {
              0% {
                opacity: 0;
                stroke-dasharray: 0 1000;
              }
              100% {
                opacity: 1;
                stroke-dasharray: 1000 0;
              }
            }

            @keyframes smoke-rise {
              0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.3; }
              100% { transform: translate(calc(-50% + var(--smoke-x)), calc(-50% - 240px)) scale(1.6); opacity: 0; }
            }

            @keyframes vignette-flicker {
              0% { opacity: 0.9; }
              60% { opacity: 0.6; }
              100% { opacity: 0; }
            }

            @keyframes boom-text {
              0% { transform: scale(0.6); opacity: 0; }
              25% { transform: scale(1.2); opacity: 1; }
              55% { transform: scale(1); opacity: 1; }
              100% { transform: scale(0.9); opacity: 0; }
            }

            body.page-exploded-strong {
              animation: page-exploded-strong-shake 0.7s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
            }

            body.page-exploded {
              animation: page-exploded-shake 0.5s ease-in-out infinite;
            }
          `}</style>
        </>
      )}
    </>
  )
}

